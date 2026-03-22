# API Documentation

Complete API reference for the Inventory Management System.

## Table of Contents
1. [Authentication](#authentication)
2. [Products API](#products-api)
3. [Stores API](#stores-api)
4. [Suppliers API](#suppliers-api)
5. [Orders API](#orders-api)
6. [Sales API](#sales-api)
7. [Reports API](#reports-api)
8. [Error Handling](#error-handling)

## Authentication

### Login User

```javascript
const { login } = useAuth()

try {
  await login(email, password)
  // User logged in successfully
} catch (error) {
  // Handle error
}
```

### Logout User

```javascript
const { logout } = useAuth()

try {
  await logout()
  // User logged out successfully
} catch (error) {
  // Handle error
}
```

### Get Current User

```javascript
const { currentUser, userRole } = useAuth()

if (currentUser) {
  console.log(currentUser.email)
  console.log(userRole) // 'super_admin', 'store_manager', 'staff'
}
```

## Products API

### Get All Products

```javascript
import { productService } from './services/firebaseService'

const products = await productService.getAllProducts()
// Returns array of products from all stores
```

### Get Products by Store

```javascript
const storeProducts = await productService.getProductsByStore(storeId)
// Returns products for specific store
```

### Get Product by ID

```javascript
const product = await productService.getProductById(productId)
// Returns specific product
```

### Add Product

```javascript
const productId = await productService.addProduct({
  name: 'Product Name',
  sku: 'SKU-001',
  barcode: '123456789',
  category: 'Electronics',
  brand: 'Brand Name',
  costPrice: 50,
  sellingPrice: 99.99,
  quantity: 100,
  minStock: 10,
  reorderPoint: 20,
  storeId: 'store-001',
  description: 'Product description'
})
// Returns new product ID
```

### Update Product

```javascript
await productService.updateProduct(productId, {
  name: 'Updated Name',
  quantity: 50,
  // ... other fields to update
})
```

### Delete Product

```javascript
await productService.deleteProduct(productId)
```

### Get Low Stock Products

```javascript
const lowStock = await productService.getLowStockProducts(threshold = 10)
// Returns products with quantity < threshold
```

### Search Products

```javascript
const results = await productService.searchProducts('search term')
// Searches by name, SKU, or barcode
```

## Categories API

### Get All Categories

```javascript
import { categoryService } from './services/firebaseService'

const categories = await categoryService.getAllCategories()
// Returns array of all categories
```

### Add Category

```javascript
const categoryId = await categoryService.addCategory({
  name: 'Electronics',
  description: 'Electronic items'
})
```

### Update Category

```javascript
await categoryService.updateCategory(categoryId, {
  name: 'Updated Name',
  description: 'Updated description'
})
```

### Delete Category

```javascript
await categoryService.deleteCategory(categoryId)
```

## Stores API

### Get All Stores

```javascript
import { storeService } from './services/firebaseService'

const stores = await storeService.getAllStores()
// Returns array of all stores
```

### Get Store by ID

```javascript
const store = await storeService.getStoreById(storeId)
// Returns specific store
```

### Add Store

```javascript
const storeId = await storeService.addStore({
  name: 'Store Name',
  location: 'Level 1, Block A',
  manager: 'Manager Name',
  phone: '+1234567890',
  email: 'store@mall.com',
  openingTime: '10:00',
  closingTime: '21:00',
  address: 'Full address',
  area: 2500
})
```

### Update Store

```javascript
await storeService.updateStore(storeId, {
  name: 'Updated Name',
  // ... other fields
})
```

### Delete Store

```javascript
await storeService.deleteStore(storeId)
```

## Suppliers API

### Get All Suppliers

```javascript
import { supplierService } from './services/firebaseService'

const suppliers = await supplierService.getAllSuppliers()
// Returns array of all suppliers
```

### Add Supplier

```javascript
const supplierId = await supplierService.addSupplier({
  name: 'Supplier Name',
  contactPerson: 'John Doe',
  phone: '+1234567890',
  email: 'supplier@example.com',
  address: 'Address',
  city: 'City',
  country: 'Country',
  paymentTerms: 'Net 30'
})
```

### Update Supplier

```javascript
await supplierService.updateSupplier(supplierId, {
  name: 'Updated Name',
  // ... other fields
})
```

### Delete Supplier

```javascript
await supplierService.deleteSupplier(supplierId)
```

## Orders API

### Get All Orders

```javascript
import { orderService } from './services/firebaseService'

const orders = await orderService.getAllOrders()
// Returns all purchase orders
```

### Create Order

```javascript
const orderId = await orderService.createOrder({
  supplierId: 'supplier-001',
  items: [
    {
      productId: 'product-001',
      productName: 'Product Name',
      quantity: 50,
      unitPrice: 25
    }
  ],
  totalAmount: 1250,
  expectedDelivery: '2024-03-20',
  status: 'pending',
  notes: 'Order notes'
})
```

### Update Order

```javascript
await orderService.updateOrder(orderId, {
  status: 'delivered',
  actualDelivery: new Date()
})
```

### Get Supplier Orders

```javascript
const supplierOrders = await orderService.getOrdersBySupplier(supplierId)
// Returns all orders from specific supplier
```

## Sales API

### Record Sale

```javascript
import { salesService } from './services/firebaseService'

const saleId = await salesService.recordSale({
  items: [
    {
      productId: 'product-001',
      productName: 'Product Name',
      quantity: 5,
      unitPrice: 99.99,
      total: 499.95
    }
  ],
  amount: 499.95,
  paymentMethod: 'cash', // 'cash', 'card', 'bank_transfer', 'cheque'
  storeId: 'store-001',
  notes: 'Sale notes'
})
```

### Get Sales by Date Range

```javascript
const startDate = new Date('2024-03-01')
const endDate = new Date('2024-03-31')

const sales = await salesService.getSales(startDate, endDate)
// Returns all sales in date range
```

### Get Daily Sales

```javascript
const dailySales = await salesService.getDailySales(new Date())
// Returns today's sales
```

## Reports API

### Calculate Statistics

```javascript
import { calculateStats } from './utils/helpers'

// Calculate revenue
const revenue = calculateStats.calculateRevenue(sales)

// Calculate profit
const profit = calculateStats.calculateProfit(revenue, costOfGoods)

// Calculate profit margin
const margin = calculateStats.calculateProfitMargin(profit, revenue)

// Get top selling products
const topProducts = calculateStats.getTopSellingProducts(sales)

// Get slow moving products
const slowMoving = calculateStats.getSlowMovingProducts(products, threshold = 5)

// Calculate inventory value
const invValue = calculateStats.calculateInventoryValue(products)
```

### Export Data

```javascript
import { exportService } from './services/exportService'

// Export to CSV
exportService.exportToCSV(data, 'filename.csv')

// Export to JSON
exportService.exportToJSON(data, 'filename.json')

// Generate Report
exportService.generateReport(reportData, 'Report Name')
```

## Activity Logs API

### Log Activity

```javascript
import { logService } from './services/firebaseService'

await logService.log(
  'CREATE',
  'Added product: Widget',
  userId
)
```

### Get Activity Logs

```javascript
const logs = await logService.getLogs(limit = 100)
// Returns latest activity logs
```

## Utility Functions

### Format Currency

```javascript
import { formatters } from './utils/helpers'

formatters.formatCurrency(99.99)
// Returns: "$99.99"
```

### Format Date

```javascript
formatters.formatDate(date)
// Returns: "03/11/2024"
```

### Format DateTime

```javascript
formatters.formatDateTime(date)
// Returns: "03/11/2024, 2:30:45 PM"
```

### Format Number

```javascript
formatters.formatNumber(1234567)
// Returns: "1,234,567"
```

### Generate SKU

```javascript
const sku = formatters.generateSKU()
// Returns: "SKU-1710208245819-abc123xyz"
```

### Generate Barcode

```javascript
const barcode = formatters.generateBarcode()
// Returns: "abc123xyz789abc"
```

## Role-Based Utilities

### Check Role Permission

```javascript
import { useRole, hasPermission } from './utils/roleUtils'

// In component
const canManage = useRole('store_manager')

// Static check
const hasAccess = hasPermission(userRole, 'super_admin')
```

## Error Handling

### Standard Error Response

```javascript
try {
  // API call
} catch (error) {
  console.error(error.message)
  // Handle specific errors
  if (error.code === 'permission-denied') {
    // Handle permission error
  }
}
```

### Error Types

| Error | Meaning |
|-------|---------|
| `permission-denied` | User lacks permission |
| `not-found` | Document/collection not found |
| `invalid-argument` | Invalid parameter |
| `already-exists` | Document already exists |
| `unavailable` | Service unavailable |
| `unauthenticated` | User not authenticated |

## Rate Limiting

Firebase has built-in rate limiting:
- Authentication: 50 requests per minute per IP
- Firestore: Based on project quota

## Pagination Example

For large datasets, use pagination:

```javascript
const pageSize = 20
let lastDoc = null

const fetchNextPage = async () => {
  let q = collection(db, 'products')
  
  if (lastDoc) {
    q = query(
      q,
      startAfter(lastDoc),
      limit(pageSize)
    )
  }
  
  const snapshot = await getDocs(q)
  lastDoc = snapshot.docs[snapshot.docs.length - 1]
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
```

## Real-time Listeners

Subscribe to real-time updates:

```javascript
import { onSnapshot, query, where } from 'firebase/firestore'

const unsubscribe = onSnapshot(
  query(collection(db, 'products'), where('storeId', '==', storeId)),
  (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    // Update state with products
  }
)

// Call to unsubscribe
unsubscribe()
```

---

**API Documentation Version**: 1.0  
**Last Updated**: March 2024
