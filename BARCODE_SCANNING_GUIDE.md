# Barcode Inventory & Sales Scanning Module
## Enterprise-Grade Implementation Guide

This document provides comprehensive setup, schema, and usage instructions for the barcode scanning module.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Features Overview](#features-overview)
3. [Firestore Schema](#firestore-schema)
4. [API Reference](#api-reference)
5. [User Workflows](#user-workflows)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

---

## 🚀 Quick Start

### 1. Access the Module
Navigate to **Barcode Scan** in the sidebar to access:
- **Barcode Scan** - Dashboard for scanning operations
- **Stock In** - Receive inventory and update stock
- **Sales Scan** - Complete POS transactions with barcode scanning

### 2. Prerequisites
- Valid barcode data in products collection (field: `barcode`)
- Staff Firebase user account
- Mobile device with camera for barcode scanning
- Products with `stock` field in Firestore

### 3. Enable Camera Access
When opening scanner for the first time:
1. Browser will request camera permission
2. Grant permission to enable barcode scanning
3. Ensure good lighting for accurate scanning

---

## ✨ Features Overview

### A. Stock In Workflow
**Purpose**: Receive inventory and update product stock levels

**Flow**:
1. Open "Stock In" page
2. Scan product barcode OR search manually
3. Enter received quantity
4. Add to stock in list
5. Complete transaction (atomic update via transaction)
6. Automatic inventory log creation
7. Real-time stock display update

**Guarantees**:
- ✅ Atomic transactions (all-or-nothing)
- ✅ Duplicate barcode handling
- ✅ Inventory audit trail
- ✅ Staff attribution
- ✅ Error rollback

### B. Sales Workflow
**Purpose**: Complete sales transactions with real-time stock deduction

**Flow**:
1. Open "Sales Scan" page
2. Scan product barcode OR search manually
3. Enter quantity sold
4. Review price calculation
5. Add to shopping cart
6. Complete sale (atomic transaction)
7. Automatic sales record & inventory log creation
8. Real-time stock deduction

**Guarantees**:
- ✅ Atomic transactions
- ✅ Stock validation before sale
- ✅ Prevents overselling
- ✅ Sale history tracking
- ✅ Staff attribution
- ✅ Anti-fraud mechanisms

### C. Barcode Scanner
**Technology**: HTML5 QR Code library (html5-qrcode)
- Supports: EAN-13, EAN-8, CODE-128, CODE-39, QR codes
- Camera access via browser APIs
- Real-time feedback
- Vibration on successful scan (mobile devices)

---

## 🗄️ Firestore Schema

### 1. Products Collection

#### Document Structure
```firestore
products/{productId}
├── name: string (e.g., "Laptop Dell XPS 13")
├── sku: string (e.g., "DELL-XPS-13-2024")
├── barcode: string (UNIQUE, e.g., "8901234567890")
│  ├── Must be unique across all products
│  ├── Used as primary lookup key for scanning
│  ├── Can be EAN-13, EAN-8, or any code format
├── price: number (e.g., 89999.99)
├── cost: number (optional, e.g., 45000)
├── stock: number (e.g., 25)
│  ├── Updated atomically by stock operations
│  ├── Never goes negative
├── category: string (e.g., "Electronics")
├── status: string (enum: "active", "inactive")
├── description: string (optional)
├── supplier: string (optional, e.g., "Dell India")
├── location: string (optional, e.g., "Shelf A-5, Row 3")
├── reorderLevel: number (minimum stock, e.g., 5)
├── createdAt: timestamp
└── updatedAt: timestamp
```

#### Example Document
```json
{
  "id": "prod_abc123def456",
  "name": "iPhone 15 Pro Max",
  "sku": "IPHONE-15PM-256GB-BLUE",
  "barcode": "8902342987456",
  "price": 119999,
  "cost": 75000,
  "stock": 12,
  "category": "Smartphones",
  "status": "active",
  "description": "iPhone 15 Pro Max 256GB Blue",
  "supplier": "Apple India",
  "location": "Display Case 2",
  "reorderLevel": 3,
  "createdAt": {"_type": "timestamp", "value": "2024-03-12T10:00:00Z"},
  "updatedAt": {"_type": "timestamp", "value": "2024-03-12T10:00:00Z"}
}
```

#### Firestore Settings
- Create **composite index** on `products` collection:
  - Fields: `status` (Ascending), `stock` (Ascending)
  - Used for: Low stock queries
- Create **unique constraint** on `barcode` field (optional, at backend)

---

### 2. Sales Collection

#### Document Structure
```firestore
sales/{saleId}
├── productId: string (reference to products/{id})
├── barcode: string (denormalized for analytics)
├── productName: string (denormalized)
├── quantity: number (units sold, e.g., 2)
├── unitPrice: number (price at time of sale, e.g., 119999)
├── totalPrice: number (quantity * unitPrice, e.g., 239998)
├── staffId: string (Firebase user ID)
├── staffName: string (email, e.g., "staff@store.com")
├── storeName: string (e.g., "Center Court Store")
├── saleDate: timestamp (when sale happened)
└── createdAt: timestamp (record creation time)
```

#### Example Document
```json
{
  "id": "sale_xyz789abc",
  "productId": "prod_abc123def456",
  "barcode": "8902342987456",
  "productName": "iPhone 15 Pro Max",
  "quantity": 2,
  "unitPrice": 119999,
  "totalPrice": 239998,
  "staffId": "user_staff_001",
  "staffName": "staff@store.com",
  "storeName": "Center Court Store",
  "saleDate": {"_type": "timestamp", "value": "2024-03-12T14:30:45Z"},
  "createdAt": {"_type": "timestamp", "value": "2024-03-12T14:30:45Z"}
}
```

#### Firestore Settings
- Create index on `saleDate` (Descending) for recent sales queries
- Create index on `staffId` for staff performance reports
- Create index on (storeName, saleDate) for store analytics

---

### 3. Inventory_logs Collection

#### Document Structure
```firestore
inventory_logs/{logId}
├── productId: string (reference)
├── barcode: string (denormalized)
├── productName: string (denormalized)
├── type: string (enum: "stock_in", "sale", "adjustment")
│  ├── "stock_in" - Received inventory
│  ├── "sale" - Sold to customer
│  └── "adjustment" - Manual correction
├── quantity: number (signed)
│  ├── Positive for inflow (stock_in, adjustment+)
│  ├── Negative for outflow (sale, adjustment-)
├── previousStock: number (before transaction)
├── newStock: number (after transaction)
├── staffId: string
├── staffName: string
├── reason: string (e.g., "Stock received", "Sale transaction", "Damaged unit")
├── storeName: string
└── timestamp: timestamp
```

#### Example Documents

**Stock In Log**:
```json
{
  "id": "log_stkin_001",
  "productId": "prod_abc123def456",
  "barcode": "8902342987456",
  "productName": "iPhone 15 Pro Max",
  "type": "stock_in",
  "quantity": 10,
  "previousStock": 5,
  "newStock": 15,
  "staffId": "user_manager_001",
  "staffName": "manager@store.com",
  "reason": "Stock received via barcode scan",
  "storeName": "Center Court Store",
  "timestamp": {"_type": "timestamp", "value": "2024-03-12T09:15:00Z"}
}
```

**Sale Log**:
```json
{
  "id": "log_sale_001",
  "productId": "prod_abc123def456",
  "barcode": "8902342987456",
  "productName": "iPhone 15 Pro Max",
  "type": "sale",
  "quantity": -2,
  "previousStock": 15,
  "newStock": 13,
  "staffId": "user_staff_001",
  "staffName": "staff@store.com",
  "reason": "Sale transaction",
  "storeName": "Center Court Store",
  "timestamp": {"_type": "timestamp", "value": "2024-03-12T14:30:45Z"}
}
```

**Adjustment Log**:
```json
{
  "id": "log_adj_001",
  "productId": "prod_abc123def456",
  "barcode": "8902342987456",
  "productName": "iPhone 15 Pro Max",
  "type": "adjustment",
  "quantity": -1,
  "previousStock": 13,
  "newStock": 12,
  "staffId": "user_manager_001",
  "staffName": "manager@store.com",
  "reason": "Damaged unit removed from inventory",
  "storeName": "Center Court Store",
  "timestamp": {"_type": "timestamp", "value": "2024-03-12T16:00:00Z"}
}
```

#### Firestore Settings
- Create index: `type` (Ascending), `timestamp` (Descending)
- Create index: `productId`, `timestamp` (Descending) - for product history
- Create index: `storeName`, `timestamp` (Descending) - for store reports

---

## 📡 API Reference

### Barcode Service

#### `findProductByBarcode(barcode)`
Finds product by exact barcode match

**Parameters**:
- `barcode` (string): Product barcode

**Returns**:
```javascript
{
  id: "prod_abc123",
  barcode: "8902342987456",
  name: "iPhone 15 Pro Max",
  price: 119999,
  stock: 12,
  sku: "IPHONE-15PM-256GB-BLUE"
}
```

**Throws**:
- `Error: Barcode cannot be empty`
- `Error: Product with barcode "..." not found`

**Usage**:
```javascript
const product = await barcodeService.findProductByBarcode('8902342987456');
```

---

#### `searchProducts(searchTerm)`
Searches by barcode, SKU, or product name (case-insensitive)

**Parameters**:
- `searchTerm` (string): Search query

**Returns**: Array of products
```javascript
[
  {
    id: "prod_abc123",
    name: "iPhone 15 Pro Max",
    barcode: "8902342987456",
    stock: 12,
    price: 119999,
    sku: "IPHONE-15PM-256GB"
  },
  // ... more products
]
```

---

#### `getLowStockProducts(threshold = 10)`
Gets products with stock below threshold

**Parameters**:
- `threshold` (number, default: 10): Stock level

**Returns**: Array of low-stock products

---

### Stock Service

#### `recordStockIn(params)`
Records stock received with atomic transaction

**Parameters**:
```javascript
{
  productId: "prod_abc123",
  barcode: "8902342987456",
  productName: "iPhone 15 Pro Max",
  quantity: 10,                    // Must be > 0
  staffId: "user_staff_001",
  staffName: "staff@store.com",
  storeName: "Center Court Store",
  reason: "Stock received"         // optional
}
```

**Returns**:
```javascript
{
  productId: "prod_abc123",
  productName: "iPhone 15 Pro Max",
  previousStock: 5,
  newStock: 15,
  quantityAdded: 10,
  logId: "log_stkin_001"
}
```

**Error Handling**:
```javascript
try {
  await stockService.recordStockIn({...});
} catch (error) {
  // Handles: invalid quantity, product not found, transaction failure
  console.error(error.message);
}
```

---

#### `recordSale(params)`
Records sale with stock deduction (atomic)

**Parameters**:
```javascript
{
  productId: "prod_abc123",
  barcode: "8902342987456",
  productName: "iPhone 15 Pro Max",
  quantity: 2,                     // Must be > 0
  unitPrice: 119999,
  staffId: "user_staff_001",
  staffName: "staff@store.com",
  storeName: "Center Court Store"
}
```

**Returns**:
```javascript
{
  saleId: "sale_xyz789abc",
  logId: "log_sale_001",
  productId: "prod_abc123",
  quantity: 2,
  totalPrice: 239998,
  previousStock: 15,
  newStock: 13
}
```

**Error Handling**:
```javascript
try {
  await stockService.recordSale({...});
} catch (error) {
  // Handles: invalid quantity, product not found,
  // insufficient stock, transaction failure
  if (error.message.includes('Insufficient stock')) {
    // Handle stock issue
  }
}
```

---

#### `recordAdjustment(params)`
Records manual stock adjustment

**Parameters**:
```javascript
{
  productId: "prod_abc123",
  barcode: "8902342987456",
  productName: "iPhone 15 Pro Max",
  quantityChange: -1,              // Can be negative
  staffId: "user_staff_001",
  staffName: "staff@store.com",
  storeName: "Center Court Store",
  reason: "Damaged unit removed"   // optional
}
```

---

### Inventory Log Service

#### `getRecentLogs(storeName, limitCount = 50)`
Gets recent inventory movements

**Usage**:
```javascript
const logs = await inventoryLogService.getRecentLogs('Center Court Store', 20);
logs.forEach(log => {
  console.log(`${log.productName}: ${log.quantity > 0 ? '+' : ''}${log.quantity}`);
});
```

---

#### `getLogsByType(type, storeName, limitCount = 50)`
Gets logs filtered by type

**Parameters**:
- `type` (string): "stock_in", "sale", or "adjustment"

```javascript
const salesLogs = await inventoryLogService.getLogsByType('sale', 'Center Court Store');
```

---

#### `getInventorySummary(storeName)`
Gets aggregate inventory metrics

**Returns**:
```javascript
{
  totalStockIn: 50,
  totalSales: 30,
  totalAdjustments: -2,
  totalTransactions: 12
}
```

---

## 👥 User Workflows

### Workflow 1: Receiving New Stock

```
1. Supplier delivers 10 units of "iPhone 15 Pro Max"
   ├─ UI: Open "Stock In" page
   ├─ Action: Click "Open Camera Scan"
   ├─ Input: Point camera at barcode "89023429874567"
   └─ Result: Product auto-populated

2. Staff verifies product details
   ├─ Display: Product name, current stock (5)
   ├─ Input: Enter quantity "10"
   └─ Action: Click "Add to Stock In"

3. Product added to list
   ├─ Display: Summary shows
   │   ├─ Items: 1
   │   ├─ Total Units: 10
   └─ Action: Option to scan more or complete

4. Staff clicks "Complete Stock In"
   ├─ Firestore Transaction:
   │   ├─ Update products/{id}: stock = 15
   │   ├─ Create inventory_logs/{logId}
   │   └─ Rollback if error
   ├─ Toast: "Stock updated for 1 product(s)"
   └─ Result: Cart cleared, ready for next batch
```

### Workflow 2: Selling Products at Counter

```
1. Customer brings iPhone 15 Pro Max to counter
   ├─ Staff opens "Sales Scan" page
   ├─ Action: Clicks scanner button
   └─ Scans barcode "89023429874567"

2. Product appears with price
   ├─ Display: Name, price (₹119,999)
   ├─ Input: Enter quantity "1"
   └─ Action: Clicks "Add to Cart"

3. Customer adds more items (optional)
   ├─ Cart shows 2 items, ₹239,998 subtotal
   └─ Action: Continue scanning or proceed

4. Staff clicks "Complete Sale"
   ├─ Firestore Transaction (per item):
   │   ├─ Verify stock available
   │   ├─ Update products/{id}: stock = 13
   │   ├─ Create sales/{saleId}
   │   ├─ Create inventory_logs/{logId}
   │   └─ Rollback if any error
   ├─ Toast: "Sale completed! 2 product(s) sold"
   ├─ Display: Invoice total ₹252,998 (with 5% tax)
   └─ Result: Cart cleared, receipt ready
```

### Workflow 3: Reporting Low Stock

```
1. Dashboard shows "Low Stock Items: 3"
2. Staff checks inventory
   ├─ Sees: "iPhone 15 Pro Max (2 units)"
   └─ Action: Generates purchase order
3. Manager reviews and approves
4. System tracks stock trend via inventory_logs
```

---

## ⚠️ Error Handling

### Common Errors and Solutions

#### 1. Camera Permission Denied
**Error Message**: "Camera access was denied. Please enable camera permissions."

**Solution**:
- Desktop: Allow camera in browser settings
- Mobile: Check app permissions → Camera
- Restart app after enabling

---

#### 2. Product Not Found
**Error Message**: `Error: Product with barcode "..." not found`

**Causes**:
- Barcode doesn't exist in database
- Barcode field is empty or wrong format
- Product status is "inactive"

**Solution**:
```javascript
// Verify barcode in Firestore
// Products > Edit > Check "barcode" field
// Ensure status = "active"

// Or use manual search
// Enter SKU or product name instead
```

---

#### 3. Insufficient Stock
**Error Message**: `Error: Insufficient stock. Available: 5, Required: 10`

**Causes**:
- Try to sell more units than available
- Concurrent sales depleted stock

**Solution**:
```javascript
// Check current stock in product details
// Reduce quantity or try another product
// Staff should inform customer: "Only 5 units available"
```

---

#### 4. Transaction Failed
**Error Message**: `Error: [FirebaseError: ... transaction failed]`

**Causes**:
- Network connectivity issue
- Firestore quota exceeded
- Database being closed

**Solution**:
- Check internet connection
- Wait and retry
- Contact IT support

---

#### 5. Duplicate Barcode
**Issue**: Multiple products have same barcode

**Prevention**:
```javascript
// Enforce UNIQUE constraint on barcode field
// Firestore doesn't have native unique constraints,
// so validate at application level before adding products

// In your product creation code:
const existingProduct = await findProductByBarcode(barcode);
if (existingProduct) {
  throw new Error('Barcode already exists');
}
```

---

## 🎯 Best Practices

### 1. Barcode Management

**✅ DO**:
- Use standard formats: EAN-13, EAN-8, CODE-128
- Store as string, not number (preserves leading zeros)
- Index barcode field for fast lookups
- Validate barcode length for your format

**❌ DON'T**:
- Use spaces or special characters
- Allow blank barcodes
- Use barcode as primary key (use Firestore ID)
- Store barcode as number (loses precision)

---

### 2. Stock Consistency

**✅ DO**:
- Always use atomic transactions (handled automatically)
- Verify stock before sales
- Create adjustment logs for discrepancies
- Review inventory_logs regularly

**❌ DON'T**:
- Update stock directly (use services)
- Allow negative stock in production
- Process sales without transaction
- Bypass validation for "quicker" processing

---

### 3. Audit Trail

**✅ DO**:
- Every stock change creates inventory_log
- Record `staffId` for accountability
- Include reason for adjustment
- Keep logs indefinitely for audit

**❌ DON'T**:
- Delete inventory logs
- Modify past logs
- Process transactions without logging
- Hide manual adjustments

---

### 4. Performance

**✅ DO**:
- Create composite indexes as specified
- Limit log queries to 50-100 records
- Cache product lookups in UI
- Batch multiple sales before checkout

**❌ DON'T**:
- Fetch all products at startup
- Query without indexes
- Load entire inventory_logs collection
- Hold transactions open too long

---

### 5. Deployment Checklist

Before going live:

- [ ] All products have valid barcodes
- [ ] Staff users created in Firebase Auth
- [ ] Firestore security rules configured
- [ ] Composite indexes deployed
- [ ] Mobile phone tested for scanning
- [ ] Camera permissions verified
- [ ] Network connectivity tested
- [ ] Error messages reviewed with staff
- [ ] Training completed
- [ ] Backup strategy documented

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

```javascript
// Daily Sales
SELECT COUNT(*) FROM sales WHERE DATE(saleDate) = TODAY

// Stock In Volume
SELECT SUM(quantity) FROM inventory_logs 
WHERE type = 'stock_in' AND timestamp >= 7_DAYS_AGO

// Low Stock Alerts
SELECT productName, stock FROM products WHERE stock < reorderLevel

// Staff Performance
SELECT staffName, COUNT(*) as transactions, SUM(quantity) as units
FROM inventory_logs WHERE timestamp >= 30_DAYS_AGO GROUP BY staffId

// Audit Trail
SELECT * FROM inventory_logs WHERE productId = 'X' ORDER BY timestamp DESC
```

---

## 🔒 Security Notes

1. **Authentication**: Only staff with Firebase auth tokens can access
2. **Data Visibility**: Logs include staff attribution for accountability
3. **Stock Recovery**: All operations are reversible via adjustments
4. **Firestore Rules**: Configure rules to restrict access by role

---

## 📱 Mobile Optimization

- Responsive design for phones and tablets
- Touch-friendly buttons (min 44px)
- Modal scanner for full attention
- Vibration feedback on scan (mobile devices)
- Offline fallback support

---

## 🆘 Support & Troubleshooting

### Barcode Not Scanning
1. Improve lighting conditions
2. Clean camera lens
3. Try QR code instead of barcode
4. Use manual search feature
5. Check if barcode format is supported

### Slow Lookups
1. Verify Firestore indexes are created
2. Check network speed
3. Use fewer decimal places in filters
4. Batch multiple scans

### Stale Stock Data
1. Refresh browser
2. Check multiple users simultaneously
3. Verify Firestore sync is complete
4. Check browser offline mode

---

**Last Updated**: March 2024
**Version**: 1.0.0
**Status**: Production Ready
