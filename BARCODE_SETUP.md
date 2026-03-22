# Firestore Setup Instructions for Barcode Scanning Module

## Quick Setup Guide

### Step 1: Create Collections

#### A. Products Collection

1. Go to Firebase Console → Firestore Database
2. Click **"Create collection"**
3. Name it `products`
4. Click **"Auto ID"** to create first document
5. Add these fields:

```json
{
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
  "createdAt": "2024-03-12T10:00:00Z",
  "updatedAt": "2024-03-12T10:00:00Z"
}
```

**Repeat** for at least 10-15 products with different barcodes

---

#### B. Sales Collection

1. Create new collection named `sales`
2. Don't add documents manually (created by app)
3. Add these sample documents for testing:

```json
{
  "productId": "prod_id_here",
  "barcode": "8902342987456",
  "productName": "iPhone 15 Pro Max",
  "quantity": 2,
  "unitPrice": 119999,
  "totalPrice": 239998,
  "staffId": "staff_001",
  "staffName": "staff@store.com",
  "storeName": "Center Court Store",
  "saleDate": "2024-03-12T14:30:45Z",
  "createdAt": "2024-03-12T14:30:45Z"
}
```

---

#### C. Inventory_logs Collection

1. Create new collection named `inventory_logs`
2. Don't add documents manually (created by app)

---

### Step 2: Create Firestore Indexes

These indexes are **critical** for performance:

#### Index 1: Products - Low Stock Query
1. Go to Firestore → Indexes tab
2. Click **"Create Index"**
3. Configure:
   - **Collection**: `products`
   - **Fields**:
     - `status` (Ascending)
     - `stock` (Ascending)
   - **Query Scope**: Collection

#### Index 2: Inventory Logs - Type & Timestamp
1. Create new index
2. Configure:
   - **Collection**: `inventory_logs`
   - **Fields**:
     - `type` (Ascending)
     - `timestamp` (Descending)
   - **Query Scope**: Collection

#### Index 3: Inventory Logs - Product History
1. Create new index
2. Configure:
   - **Collection**: `inventory_logs`
   - **Fields**:
     - `productId` (Ascending)
     - `timestamp` (Descending)
   - **Query Scope**: Collection

#### Index 4: Inventory Logs - Store Reports
1. Create new index
2. Configure:
   - **Collection**: `inventory_logs`
   - **Fields**:
     - `storeName` (Ascending)
     - `timestamp` (Descending)
   - **Query Scope**: Collection

#### Index 5: Sales - Staff Performance
1. Create new index
2. Configure:
   - **Collection**: `sales`
   - **Fields**:
     - `staffId` (Ascending)
     - `saleDate` (Descending)
   - **Query Scope**: Collection

---

### Step 3: Configure Security Rules

Go to Firestore → Rules tab

Replace default rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Products - Readable by all authenticated users
    match /products/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.email_verified && 
                      request.auth.token.admin == true;
    }

    // Sales - Writable only by staff/manager
    match /sales/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       (request.auth.token.role == 'staff' || 
                        request.auth.token.role == 'manager' ||
                        request.auth.token.role == 'admin');
      allow update, delete: if request.auth.token.role == 'admin';
    }

    // Inventory Logs - Writable only by staff/manager
    match /inventory_logs/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                       (request.auth.token.role == 'staff' ||
                        request.auth.token.role == 'manager' ||
                        request.auth.token.role == 'admin');
      allow update, delete: if request.auth.token.role == 'admin';
    }

    // Users - Store staff role info
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId ||
                       request.auth.token.role == 'admin';
    }
  }
}
```

Click **"Publish"**

---

### Step 4: Create Test Products

Use Firebase Console or import the following JSON:

#### Product 1
```json
{
  "name": "Samsung Galaxy S24 Ultra",
  "sku": "SAMSUNG-S24-ULTRA-TITANIUM",
  "barcode": "8902142987456",
  "price": 129999,
  "cost": 80000,
  "stock": 8,
  "category": "Smartphones",
  "status": "active",
  "description": "Samsung Galaxy S24 Ultra 512GB Titanium",
  "supplier": "Samsung India",
  "location": "Display Case 1",
  "reorderLevel": 2,
  "createdAt": "2024-03-12T10:00:00Z",
  "updatedAt": "2024-03-12T10:00:00Z"
}
```

#### Product 2
```json
{
  "name": "MacBook Pro 14-inch",
  "sku": "APPLE-MBP14-M3MAX",
  "barcode": "8903342987456",
  "price": 209999,
  "cost": 130000,
  "stock": 5,
  "category": "Laptops",
  "status": "active",
  "description": "MacBook Pro 14-inch M3 Max 1TB",
  "supplier": "Apple India",
  "location": "Laptop Section",
  "reorderLevel": 1,
  "createdAt": "2024-03-12T10:00:00Z",
  "updatedAt": "2024-03-12T10:00:00Z"
}
```

#### Product 3
```json
{
  "name": "Sony WH-1000XM5",
  "sku": "SONY-WH1000XM5-BLACK",
  "barcode": "8904342987456",
  "price": 29999,
  "cost": 18000,
  "stock": 25,
  "category": "Headphones",
  "status": "active",
  "description": "Sony WH-1000XM5 Noise Cancelling Headphones Black",
  "supplier": "Sony India",
  "location": "Electronics Section",
  "reorderLevel": 5,
  "createdAt": "2024-03-12T10:00:00Z",
  "updatedAt": "2024-03-12T10:00:00Z"
}
```

[Add 7-12 more products with unique barcodes...]

---

### Step 5: Create Test Staff Users

1. Go to Firebase Console → Authentication
2. Click **"Add user"** (or use Email/Password)
3. Create staff users:

#### Staff User 1
- **Email**: `staff@store.com`
- **Password**: `123456` (or secure password)

#### Staff User 2
- **Email**: `staff2@store.com`
- **Password**: `123456`

#### Manager User
- **Email**: `manager@store.com`
- **Password**: `123456`

---

### Step 6: Assign Roles in Users Collection

1. Go to Firestore → `users` collection
2. Create documents for each user UUID:

**Document ID**: [Firebase User UID for staff@store.com]
```json
{
  "email": "staff@store.com",
  "role": "staff",
  "storeName": "Center Court Store",
  "createdAt": "2024-03-12T10:00:00Z"
}
```

**Document ID**: [Firebase User UID for manager@store.com]
```json
{
  "email": "manager@store.com",
  "role": "manager",
  "storeName": "Center Court Store",
  "createdAt": "2024-03-12T10:00:00Z"
}
```

---

### Step 7: Test the Module

1. **Logout** from current user
2. **Login** as staff@store.com / 123456
3. **Navigate** to Barcode Scan in sidebar
4. **Open** Stock In or Sales Scan
5. **Scan barcode** using phone camera (or enter manually)
6. **Complete transaction**
7. **Verify** inventory_logs collection has new entries

---

## Generating Test Barcodes

If you don't have real barcodes, use an online barcode generator:

### Option 1: Online Generator
1. Visit https://www.barcodegenerator.org/
2. Enter a unique number (e.g., 8902342987456)
3. Select format: EAN-13
4. Generate and print

### Option 2: Mobile Testing
You can test with QR codes instead:
1. Visit https://www.qr-code-generator.com/
2. Enter your barcode number
3. Generate QR code
4. Point phone camera at QR code in browser
5. Scanner will recognize it

### Option 3: Use Demo Barcodes
For testing without printing, use these standard barcodes:
```
5901234123457 (Valid EAN-13)
96385074 (Valid EAN-8)
12345678 (Test barcode)
```

---

## Importing Data (Bulk)

If you have products in CSV format:

1. Prepare CSV with columns: name, sku, barcode, price, stock, category
2. Use Firebase Import tools or third-party services
3. Or use Python script:

```python
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import csv

# Initialize Firebase
cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Read CSV and import
with open('products.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        db.collection('products').add({
            'name': row['name'],
            'sku': row['sku'],
            'barcode': row['barcode'],
            'price': float(row['price']),
            'cost': float(row['cost']),
            'stock': int(row['stock']),
            'category': row['category'],
            'status': 'active',
            'reorderLevel': int(row.get('reorderLevel', '5')),
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        })
```

---

## Verification Checklist

- [ ] `products` collection created with test data
- [ ] `sales` collection created (empty)
- [ ] `inventory_logs` collection created (empty)
- [ ] All 5 indexes created and deployed
- [ ] Security rules published
- [ ] `users` collection with role documents
- [ ] Test staff users created in Authentication
- [ ] Can login as staff@store.com
- [ ] Can access Barcode Scan in sidebar
- [ ] Camera permissions work on phone
- [ ] Can scan and complete transactions
- [ ] Inventory logs appear after transaction
- [ ] Stock decreases correctly

---

## Common Issues

### Indexes Not Showing
- Firestore indexes take 1-2 minutes to build
- Check Firestore indexes tab for status
- Error queries show which index is missing

### Cannot Create Products
- Check Security Rules allow writes for admin
- Verify authenticated user has admin token
- Debug: Check browser console for error messages

### Barcode Not Found
- Verify barcode field exists in product
- Ensure barcode is exact match (case-sensitive)
- Check if product status is "active"

### Transactions Fail
- Check Firestore quota not exceeded
- Ensure network connectivity
- Review error logs in browser console
- Verify product stock is non-negative

---

## Production Checklist

Before deploying to production:

- [ ] All products have valid, unique barcodes
- [ ] Role-based access configured
- [ ] Backup strategy documented
- [ ] Audit logging enabled
- [ ] Performance indexes deployed
- [ ] Staff trained on system
- [ ] Mobile testing completed
- [ ] Network latency acceptable
- [ ] Error handling tested
- [ ] Recovery procedures documented

---

## Support

For issues:
1. Check browser console for errors (F12)
2. Review Firestore rules (allow/deny reasons)
3. Verify indexes are deployed
4. Check network connectivity
5. Contact Firebase support with project ID

**Project ID**: `marketdekho-90910973-9ec12`

---

**Setup Last Updated**: March 2024
