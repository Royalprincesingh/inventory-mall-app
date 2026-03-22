// Mock Firebase Services using localStorage
// This allows the app to work without real Firebase credentials

const getDB = () => {
  const dbStr = localStorage.getItem('mockDB')
  if (!dbStr) {
    const initialData = {
      products: [
        { id: '1', name: 'Wireless Headphones', sku: 'SKU-001', barcode: 'BAR-001', category: 'Electronics', brand: 'TechPro', quantity: 45, minStock: 10, costPrice: 2000, sellingPrice: 4500, description: 'High quality wireless headphones', soldUnits: 120, status: 'in_stock' },
        { id: '2', name: 'Designer T-Shirt', sku: 'SKU-002', barcode: 'BAR-002', category: 'Clothing', brand: 'FashionPlus', quantity: 120, minStock: 20, costPrice: 500, sellingPrice: 1200, description: 'Premium designer t-shirt', soldUnits: 250, status: 'in_stock' },
        { id: '3', name: 'Organic Coffee Beans', sku: 'SKU-003', barcode: 'BAR-003', category: 'Food & Beverages', brand: 'FreshFoods', quantity: 5, minStock: 15, costPrice: 300, sellingPrice: 700, description: 'Freshly roasted organic coffee', soldUnits: 89, status: 'low_stock' },
        { id: '4', name: 'Ceramic Dinner Set', sku: 'SKU-004', barcode: 'BAR-004', category: 'Home & Kitchen', brand: 'HomeComfort', quantity: 22, minStock: 5, costPrice: 1500, sellingPrice: 3500, description: 'Beautiful ceramic dinner set', soldUnits: 45, status: 'in_stock' },
        { id: '5', name: 'Natural Face Cream', sku: 'SKU-005', barcode: 'BAR-005', category: 'Beauty & Personal Care', brand: 'BeautyWorld', quantity: 38, minStock: 10, costPrice: 800, sellingPrice: 2200, description: 'Natural and organic face cream', soldUnits: 156, status: 'in_stock' },
      ],
      categories: [
        { id: '1', name: 'Electronics', description: 'Electronic gadgets and devices' },
        { id: '2', name: 'Clothing', description: 'Apparel and fashion items' },
        { id: '3', name: 'Food & Beverages', description: 'Food and drink products' },
        { id: '4', name: 'Home & Kitchen', description: 'Home and kitchen items' },
        { id: '5', name: 'Beauty & Personal Care', description: 'Beauty and personal care' },
      ],
      stores: [
        { id: '1', name: 'Electronics Store', location: 'Ground Floor', manager: 'John Doe', phone: '9876543210', email: 'john@mall.com', openingTime: '09:00', closingTime: '21:00', address: 'Mall Ground Floor' },
        { id: '2', name: 'Fashion Boutique', location: 'Level 1', manager: 'Sarah Smith', phone: '9876543211', email: 'sarah@mall.com', openingTime: '09:00', closingTime: '21:00', address: 'Mall Level 1' },
        { id: '3', name: 'Food Court', location: 'Level 2', manager: 'Mike Johnson', phone: '9876543212', email: 'mike@mall.com', openingTime: '09:00', closingTime: '23:00', address: 'Mall Level 2' },
      ],
      suppliers: [
        { id: '1', name: 'Global Supplies Inc', contactPerson: 'Alex Brown', phone: '9876543210', email: 'alex@global.com', address: '123 Business St', city: 'Mumbai', paymentTerms: 'Net 30', rating: 4.5 },
        { id: '2', name: 'Asian Wholesalers Ltd', contactPerson: 'Chen Wei', phone: '9876543211', email: 'chen@asian.com', address: '456 Trade Ave', city: 'Delhi', paymentTerms: 'Net 45', rating: 4.2 },
        { id: '3', name: 'European Trade Co', contactPerson: 'Marco Rossi', phone: '9876543212', email: 'marco@euro.com', address: '789 Import Rd', city: 'Bangalore', paymentTerms: 'Net 60', rating: 4.8 },
      ],
      orders: [
        { id: '1', supplierId: '1', orderNumber: 'ORD-001', totalAmount: 45000, status: 'delivered', expectedDelivery: '2024-03-15', actualDelivery: '2024-03-15', items: [], notes: 'Delivered on time', createdAt: new Date().toISOString() },
        { id: '2', supplierId: '2', orderNumber: 'ORD-002', totalAmount: 32000, status: 'pending', expectedDelivery: '2024-03-12', items: [], notes: '', createdAt: new Date().toISOString() },
        { id: '3', supplierId: '3', orderNumber: 'ORD-003', totalAmount: 78000, status: 'confirmed', expectedDelivery: '2024-03-14', items: [], notes: '', createdAt: new Date().toISOString() },
      ],
      sales: [
        { id: '1', product: 'Wireless Headphones', quantity: 2, unitPrice: 4500, amount: 9000, paymentMethod: 'card', paymentStatus: 'completed', notes: '', createdAt: new Date().toISOString() },
        { id: '2', product: 'Designer T-Shirt', quantity: 5, unitPrice: 1200, amount: 6000, paymentMethod: 'cash', paymentStatus: 'completed', notes: '', createdAt: new Date().toISOString() },
        { id: '3', product: 'Natural Face Cream', quantity: 3, unitPrice: 2200, amount: 6600, paymentMethod: 'card', paymentStatus: 'completed', notes: '', createdAt: new Date().toISOString() },
        { id: '4', product: 'Ceramic Dinner Set', quantity: 1, unitPrice: 3500, amount: 3500, paymentMethod: 'bank_transfer', paymentStatus: 'completed', notes: '', createdAt: new Date().toISOString() },
      ],
      logs: [
        { id: '1', action: 'login', details: 'Admin user logged in', userId: 'admin-123', timestamp: new Date().toISOString() },
        { id: '2', action: 'create', details: 'New product added: Wireless Headphones', userId: 'admin-123', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', action: 'update', details: 'Product updated: Organic Coffee Beans', userId: 'manager-456', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: '4', action: 'delete', details: 'Product deleted', userId: 'admin-123', timestamp: new Date(Date.now() - 10800000).toISOString() },
      ],
    }
    localStorage.setItem('mockDB', JSON.stringify(initialData))
    return initialData
  }
  return JSON.parse(dbStr)
}

const saveDB = (data) => {
  localStorage.setItem('mockDB', JSON.stringify(data))
}

export const productService = {
  async getAllProducts(storeId) {
    const db = getDB()
    return db.products
  },

  async getProductById(id) {
    const db = getDB()
    const product = db.products.find(p => p.id === id)
    return product
  },

  async addProduct(data) {
    const db = getDB()
    const newProduct = {
      id: String(Date.now()),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.products.push(newProduct)
    saveDB(db)
    return newProduct
  },

  async updateProduct(id, data) {
    const db = getDB()
    const index = db.products.findIndex(p => p.id === id)
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...data, updatedAt: new Date().toISOString() }
      saveDB(db)
      return db.products[index]
    }
    return null
  },

  async deleteProduct(id) {
    const db = getDB()
    db.products = db.products.filter(p => p.id !== id)
    saveDB(db)
  },

  async getLowStockProducts(threshold) {
    const db = getDB()
    return db.products.filter(p => p.quantity < (threshold || 10))
  },

  async searchProducts(term) {
    const db = getDB()
    const results = db.products.filter(p => p.name.toLowerCase().includes(term.toLowerCase()) || p.sku.includes(term))
    return results
  },
}

export const categoryService = {
  async getAllCategories() {
    const db = getDB()
    return db.categories
  },

  async addCategory(data) {
    const db = getDB()
    const newCategory = { id: String(Date.now()), ...data }
    db.categories.push(newCategory)
    saveDB(db)
    return newCategory
  },

  async updateCategory(id, data) {
    const db = getDB()
    const index = db.categories.findIndex(c => c.id === id)
    if (index !== -1) {
      db.categories[index] = { ...db.categories[index], ...data }
      saveDB(db)
      return db.categories[index]
    }
    return null
  },

  async deleteCategory(id) {
    const db = getDB()
    db.categories = db.categories.filter(c => c.id !== id)
    saveDB(db)
  },
}

export const storeService = {
  async getAllStores() {
    const db = getDB()
    return Promise.resolve({ data: db.stores })
  },

  async getStoreById(id) {
    const db = getDB()
    const store = db.stores.find(s => s.id === id)
    return Promise.resolve({ data: store })
  },

  async addStore(data) {
    const db = getDB()
    const newStore = { id: String(Date.now()), ...data, createdAt: new Date().toISOString() }
    db.stores.push(newStore)
    saveDB(db)
    return Promise.resolve({ data: newStore })
  },

  async updateStore(id, data) {
    const db = getDB()
    const index = db.stores.findIndex(s => s.id === id)
    if (index !== -1) {
      db.stores[index] = { ...db.stores[index], ...data, updatedAt: new Date().toISOString() }
      saveDB(db)
      return Promise.resolve({ data: db.stores[index] })
    }
    return Promise.resolve({ data: null })
  },

  async deleteStore(id) {
    const db = getDB()
    db.stores = db.stores.filter(s => s.id !== id)
    saveDB(db)
    return Promise.resolve()
  },
}

export const supplierService = {
  async getAllSuppliers() {
    const db = getDB()
    return Promise.resolve({ data: db.suppliers })
  },

  async addSupplier(data) {
    const db = getDB()
    const newSupplier = { id: String(Date.now()), ...data, createdAt: new Date().toISOString() }
    db.suppliers.push(newSupplier)
    saveDB(db)
    return Promise.resolve({ data: newSupplier })
  },

  async updateSupplier(id, data) {
    const db = getDB()
    const index = db.suppliers.findIndex(s => s.id === id)
    if (index !== -1) {
      db.suppliers[index] = { ...db.suppliers[index], ...data, updatedAt: new Date().toISOString() }
      saveDB(db)
      return Promise.resolve({ data: db.suppliers[index] })
    }
    return Promise.resolve({ data: null })
  },

  async deleteSupplier(id) {
    const db = getDB()
    db.suppliers = db.suppliers.filter(s => s.id !== id)
    saveDB(db)
    return Promise.resolve()
  },
}

export const orderService = {
  async getAllOrders() {
    const db = getDB()
    return Promise.resolve({ data: db.orders })
  },

  async createOrder(data) {
    const db = getDB()
    const newOrder = { id: String(Date.now()), orderNumber: `ORD-${Date.now()}`, ...data, createdAt: new Date().toISOString() }
    db.orders.push(newOrder)
    saveDB(db)
    return Promise.resolve({ data: newOrder })
  },

  async updateOrder(id, data) {
    const db = getDB()
    const index = db.orders.findIndex(o => o.id === id)
    if (index !== -1) {
      db.orders[index] = { ...db.orders[index], ...data, updatedAt: new Date().toISOString() }
      saveDB(db)
      return Promise.resolve({ data: db.orders[index] })
    }
    return Promise.resolve({ data: null })
  },

  async deleteOrder(id) {
    const db = getDB()
    db.orders = db.orders.filter(o => o.id !== id)
    saveDB(db)
    return Promise.resolve()
  },

  async getOrdersBySupplier(supplierId) {
    const db = getDB()
    const orders = db.orders.filter(o => o.supplierId === supplierId)
    return Promise.resolve({ data: orders })
  },
}

export const salesService = {
  async recordSale(data) {
    const db = getDB()
    const newSale = { id: String(Date.now()), ...data, createdAt: new Date().toISOString() }
    db.sales.push(newSale)
    saveDB(db)
    return Promise.resolve({ data: newSale })
  },

  async getSales(startDate, endDate) {
    const db = getDB()
    return Promise.resolve({ data: db.sales })
  },

  async getDailySales(date) {
    const db = getDB()
    return Promise.resolve({ data: db.sales })
  },
}

export const logService = {
  async log(action, details, userId) {
    const db = getDB()
    const newLog = {
      id: String(Date.now()),
      action,
      details,
      userId,
      timestamp: new Date().toISOString(),
    }
    db.logs.push(newLog)
    saveDB(db)
    return Promise.resolve({ data: newLog })
  },

  async getLogs(limit) {
    const db = getDB()
    return Promise.resolve({ data: db.logs.slice(0, limit || 500) })
  },
}
