// Mock Firebase for development/demo without real credentials
// This uses localStorage instead of real Firebase

class MockAuth {
  constructor() {
    this.currentUser = localStorage.getItem('mockUser') ? JSON.parse(localStorage.getItem('mockUser')) : null
  }

  async signInWithEmailAndPassword(email, password) {
    // Mock users
    const mockUsers = {
      'admin@mall.com': { email: 'admin@mall.com', password: 'admin123', uid: 'admin-123', role: 'super_admin' },
      'manager@store.com': { email: 'manager@store.com', password: 'manager123', uid: 'manager-456', role: 'store_manager' },
      'staff@store.com': { email: 'staff@store.com', password: 'staff123', uid: 'staff-789', role: 'staff' },
    }

    const user = mockUsers[email]
    if (user && user.password === password) {
      const userData = { uid: user.uid, email: user.email }
      localStorage.setItem('mockUser', JSON.stringify(userData))
      localStorage.setItem('mockUserRole', user.role)
      this.currentUser = userData
      return { user: userData }
    }
    throw new Error('auth/invalid-email')
  }

  async signOut() {
    localStorage.removeItem('mockUser')
    localStorage.removeItem('mockUserRole')
    this.currentUser = null
  }

  onAuthStateChanged(callback) {
    const user = localStorage.getItem('mockUser') ? JSON.parse(localStorage.getItem('mockUser')) : null
    this.currentUser = user
    setTimeout(() => callback(user), 100)
    return () => {} // unsubscribe
  }
}

class MockDatabase {
  constructor() {
    this.init()
  }

  init() {
    if (!localStorage.getItem('mockDB')) {
      const initialData = {
        products: [
          { id: '1', name: 'Wireless Headphones', sku: 'SKU-001', category: 'Electronics', quantity: 45, minStock: 10, costPrice: 2000, sellingPrice: 4500 },
          { id: '2', name: 'Designer T-Shirt', sku: 'SKU-002', category: 'Clothing', quantity: 120, minStock: 20, costPrice: 500, sellingPrice: 1200 },
          { id: '3', name: 'Organic Coffee Beans', sku: 'SKU-003', category: 'Food', quantity: 5, minStock: 15, costPrice: 300, sellingPrice: 700 },
          { id: '4', name: 'Ceramic Dinner Set', sku: 'SKU-004', category: 'Home', quantity: 22, minStock: 5, costPrice: 1500, sellingPrice: 3500 },
          { id: '5', name: 'Natural Face Cream', sku: 'SKU-005', category: 'Beauty', quantity: 38, minStock: 10, costPrice: 800, sellingPrice: 2200 },
        ],
        categories: [
          { id: '1', name: 'Electronics' },
          { id: '2', name: 'Clothing' },
          { id: '3', name: 'Food & Beverages' },
          { id: '4', name: 'Home & Kitchen' },
          { id: '5', name: 'Beauty & Personal Care' },
        ],
        stores: [
          { id: '1', name: 'Electronics Store', location: 'Ground Floor', manager: 'John Doe' },
          { id: '2', name: 'Fashion Boutique', location: 'Level 1', manager: 'Sarah Smith' },
          { id: '3', name: 'Food Court', location: 'Level 2', manager: 'Mike Johnson' },
        ],
        suppliers: [
          { id: '1', name: 'Global Supplies Inc', contactPerson: 'Alex Brown', phone: '9876543210', rating: 4.5 },
          { id: '2', name: 'Asian Wholesalers Ltd', contactPerson: 'Chen Wei', phone: '9876543211', rating: 4.2 },
          { id: '3', name: 'European Trade Co', contactPerson: 'Marco Rossi', phone: '9876543212', rating: 4.8 },
        ],
        orders: [
          { id: '1', supplierId: '1', totalAmount: 45000, status: 'delivered', expectedDelivery: '2024-03-15' },
          { id: '2', supplierId: '2', totalAmount: 32000, status: 'pending', expectedDelivery: '2024-03-12' },
          { id: '3', supplierId: '3', totalAmount: 78000, status: 'confirmed', expectedDelivery: '2024-03-14' },
        ],
        sales: [
          { id: '1', product: 'Wireless Headphones', quantity: 2, amount: 9000, paymentMethod: 'card', date: new Date().toISOString() },
          { id: '2', product: 'Designer T-Shirt', quantity: 5, amount: 6000, paymentMethod: 'cash', date: new Date().toISOString() },
          { id: '3', product: 'Natural Face Cream', quantity: 3, amount: 6600, paymentMethod: 'card', date: new Date().toISOString() },
        ],
        logs: [
          { id: '1', action: 'login', details: 'User logged in', userId: 'admin-123', timestamp: new Date().toISOString() },
          { id: '2', action: 'create', details: 'Product created', userId: 'admin-123', timestamp: new Date().toISOString() },
          { id: '3', action: 'update', details: 'Product updated', userId: 'manager-456', timestamp: new Date().toISOString() },
        ],
      }
      localStorage.setItem('mockDB', JSON.stringify(initialData))
    }
  }

  getData(collection) {
    const db = JSON.parse(localStorage.getItem('mockDB') || '{}')
    return db[collection] || []
  }

  setData(collection, data) {
    const db = JSON.parse(localStorage.getItem('mockDB') || '{}')
    db[collection] = data
    localStorage.setItem('mockDB', JSON.stringify(db))
  }

  addItem(collection, item) {
    const data = this.getData(collection)
    item.id = String(Date.now())
    data.push(item)
    this.setData(collection, data)
    return item
  }

  updateItem(collection, id, updates) {
    const data = this.getData(collection)
    const index = data.findIndex(item => item.id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...updates }
      this.setData(collection, data)
    }
  }

  deleteItem(collection, id) {
    const data = this.getData(collection)
    const filtered = data.filter(item => item.id !== id)
    this.setData(collection, filtered)
  }
}

export const auth = new MockAuth()
export const db = new MockDatabase()
export const storage = { getDownloadURL: () => Promise.resolve('') }
export const functions = {}

export default {}
