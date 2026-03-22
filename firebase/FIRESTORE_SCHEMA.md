# Firestore Database Schema

## Collections Structure

### 1. **users** Collection
```
/users/{userId}
├── email (string)
├── name (string)
├── role (string) - 'super_admin', 'store_manager', 'staff'
├── phone (string)
├── storeId (string) - Reference to store
├── status (string) - 'active', 'inactive'
├── createdAt (timestamp)
├── lastLogin (timestamp)
└── permissions (array)
```

### 2. **products** Collection
```
/products/{productId}
├── name (string)
├── sku (string)
├── barcode (string)
├── category (string) - Reference to category ID
├── brand (string)
├── description (string)
├── costPrice (number)
├── sellingPrice (number)
├── quantity (number)
├── minStock (number)
├── reorderPoint (number)
├── storeId (string) - Reference to store
├── supplier (string) - Reference to supplier
├── status (string) - 'active', 'inactive', 'discontinued'
├── images (array) - URLs to product images
├── createdAt (timestamp)
├── updatedAt (timestamp)
├── lastRestocked (timestamp)
└── soldUnits (number) - Total units sold
```

### 3. **categories** Collection
```
/categories/{categoryId}
├── name (string)
├── description (string)
├── parentCategory (string) - Reference to parent category
├── image (string) - URL
├── status (string) - 'active', 'inactive'
└── createdAt (timestamp)
```

### 4. **brands** Collection
```
/brands/{brandId}
├── name (string)
├── description (string)
├── country (string)
├── website (string)
└── logo (string) - URL
```

### 5. **stores** Collection
```
/stores/{storeId}
├── name (string)
├── location (string)
├── phone (string)
├── email (string)
├── manager (string)
├── openingTime (string) - HH:MM format
├── closingTime (string) - HH:MM format
├── address (string)
├── area (number) - Store area in sq ft
├── totalProducts (number)
├── status (string) - 'active', 'inactive', 'under_construction'
├── createdAt (timestamp)
└── updatedAt (timestamp)
```

### 6. **suppliers** Collection
```
/suppliers/{supplierId}
├── name (string)
├── contactPerson (string)
├── phone (string)
├── email (string)
├── address (string)
├── city (string)
├── country (string)
├── paymentTerms (string)
├── rating (number) - 1-5 stars
├── status (string) - 'active', 'inactive'
├── createdAt (timestamp)
└── bankDetails (object)
│   ├── accountHolder (string)
│   ├── accountNumber (string)
│   └── bankName (string)
```

### 7. **purchase_orders** Collection
```
/purchase_orders/{orderId}
├── supplierId (string) - Reference to supplier
├── orderNumber (string) - Unique order number
├── items (array)
│   ├── productId (string)
│   ├── productName (string)
│   ├── quantity (number)
│   ├── unitPrice (number)
│   └── totalPrice (number)
├── totalAmount (number)
├── status (string) - 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
├── expectedDelivery (timestamp)
├── actualDelivery (timestamp)
├── notes (string)
├── createdBy (string) - User ID
├── createdAt (timestamp)
└── updatedAt (timestamp)
```

### 8. **sales** Collection
```
/sales/{saleId}
├── items (array)
│   ├── productId (string)
│   ├── productName (string)
│   ├── quantity (number)
│   ├── unitPrice (number)
│   └── total (number)
├── amount (number)
├── paymentMethod (string) - 'cash', 'card', 'bank_transfer', 'cheque'
├── paymentStatus (string) - 'paid', 'pending'
├── storeId (string) - Reference to store
├── staffId (string) - User who recorded sale
├── notes (string)
├── createdAt (timestamp)
├── updatedAt (timestamp)
└── costOfGoods (number)
```

### 9. **inventory_movements** Collection
```
/inventory_movements/{movementId}
├── productId (string)
├── productName (string)
├── type (string) - 'in', 'out', 'adjustment', 'return'
├── quantity (number)
├── reason (string) - 'purchase', 'sale', 'damage', 'loss', 'return'
├── fromStore (string) - Reference to store (for transfers)
├── toStore (string) - Reference to store (for transfers)
├── reference (string) - Order ID or Sale ID
├── notes (string)
├── createdBy (string) - User ID
├── createdAt (timestamp)
└── previousQuantity (number)
```

### 10. **activity_logs** Collection
```
/activity_logs/{logId}
├── action (string) - Type of action performed
├── details (string) - Description of what happened
├── userId (string) - User who performed action
├── userName (string)
├── storeId (string)
├── affectedDocumentId (string)
├── affectedDocumentType (string)
├── ip (string) - User IP address
├── timestamp (timestamp)
└── status (string) - 'success', 'failed'
```

### 11. **reports** Collection
```
/reports/{reportId}
├── title (string)
├── type (string) - 'sales', 'inventory', 'profit_loss', 'movement'
├── period (string) - 'daily', 'weekly', 'monthly', 'custom'
├── startDate (timestamp)
├── endDate (timestamp)
├── data (object) - Report data
├── generatedBy (string) - User ID
├── generatedAt (timestamp)
└── expiresAt (timestamp)
```

### 12. **notifications** Collection
```
/notifications/{notificationId}
├── type (string) - 'low_stock', 'order_arrived', 'sale_alert'
├── title (string)
├── message (string)
├── recipientId (string) - User ID
├── read (boolean)
├── actionUrl (string)
├── createdAt (timestamp)
└── expiresAt (timestamp)
```

## Indexes Recommended

For better query performance, create the following indexes:

1. **products**: (storeId, quantity) for low stock queries
2. **products**: (category, status) for category browsing
3. **sales**: (createdAt, storeId) for daily reports
4. **purchase_orders**: (supplierId, status) for supplier orders
5. **activity_logs**: (userId, timestamp) for user action tracking
6. **inventory_movements**: (productId, createdAt) for movement history

## Sample Data Setup

After deploying, initialize with sample data:
- Create demo categories (Electronics, Clothing, Food, etc.)
- Create demo brands
- Create demo stores
- Create demo suppliers
- Create demo users with different roles
