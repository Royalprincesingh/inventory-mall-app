// Real Firebase Services using Firestore
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  startAt,
  endAt,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'

// Initialize Firestore collections
const COLLECTIONS = {
  products: 'products',
  categories: 'categories',
  stores: 'stores',
  suppliers: 'suppliers',
  orders: 'orders',
  sales: 'sales',
  logs: 'logs',
}

// Helper to convert Firestore timestamp
const convertDocData = (doc) => ({
  id: doc.id,
  ...doc.data(),
})

// Product Service
export const productService = {
  async getAllProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.products))
      return querySnapshot.docs.map(convertDocData)
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },

  async getProductById(id) {
    try {
      const docRef = doc(db, COLLECTIONS.products, id)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? convertDocData(docSnap) : null
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  },

  async addProduct(data) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.products), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  },

  async updateProduct(id, data) {
    try {
      const docRef = doc(db, COLLECTIONS.products, id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      })
      return { id, ...data }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  async deleteProduct(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.products, id))
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },

  async getLowStockProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.products))
      return querySnapshot.docs
        .map(convertDocData)
        .filter(p => p.quantity < p.minStock)
    } catch (error) {
      console.error('Error fetching low stock products:', error)
      return []
    }
  },

  async searchProducts(searchTerm) {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.products))
      const results = querySnapshot.docs
        .map(convertDocData)
        .filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase())
        )
      return results
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  },
}

// Category Service
export const categoryService = {
  async getAllCategories() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.categories))
      return querySnapshot.docs.map(convertDocData)
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },

  async getCategoryById(id) {
    try {
      const docRef = doc(db, COLLECTIONS.categories, id)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? convertDocData(docSnap) : null
    } catch (error) {
      console.error('Error fetching category:', error)
      return null
    }
  },

  async addCategory(data) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.categories), data)
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error('Error adding category:', error)
      throw error
    }
  },

  async updateCategory(id, data) {
    try {
      const docRef = doc(db, COLLECTIONS.categories, id)
      await updateDoc(docRef, data)
      return { id, ...data }
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  async deleteCategory(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.categories, id))
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  },
}

// Store Service
export const storeService = {
  async getAllStores() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.stores))
      return querySnapshot.docs.map(convertDocData)
    } catch (error) {
      console.error('Error fetching stores:', error)
      return []
    }
  },

  async getStoreById(id) {
    try {
      const docRef = doc(db, COLLECTIONS.stores, id)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? convertDocData(docSnap) : null
    } catch (error) {
      console.error('Error fetching store:', error)
      return null
    }
  },

  async addStore(data) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.stores), data)
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error('Error adding store:', error)
      throw error
    }
  },

  async updateStore(id, data) {
    try {
      const docRef = doc(db, COLLECTIONS.stores, id)
      await updateDoc(docRef, data)
      return { id, ...data }
    } catch (error) {
      console.error('Error updating store:', error)
      throw error
    }
  },

  async deleteStore(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.stores, id))
      return true
    } catch (error) {
      console.error('Error deleting store:', error)
      throw error
    }
  },
}

// Supplier Service
export const supplierService = {
  async getAllSuppliers() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.suppliers))
      return querySnapshot.docs.map(convertDocData)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      return []
    }
  },

  async getSupplierById(id) {
    try {
      const docRef = doc(db, COLLECTIONS.suppliers, id)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? convertDocData(docSnap) : null
    } catch (error) {
      console.error('Error fetching supplier:', error)
      return null
    }
  },

  async addSupplier(data) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.suppliers), data)
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error('Error adding supplier:', error)
      throw error
    }
  },

  async updateSupplier(id, data) {
    try {
      const docRef = doc(db, COLLECTIONS.suppliers, id)
      await updateDoc(docRef, data)
      return { id, ...data }
    } catch (error) {
      console.error('Error updating supplier:', error)
      throw error
    }
  },

  async deleteSupplier(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.suppliers, id))
      return true
    } catch (error) {
      console.error('Error deleting supplier:', error)
      throw error
    }
  },
}

// Order Service
export const orderService = {
  async getAllOrders() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.orders), orderBy('createdAt', 'desc'))
      )
      return querySnapshot.docs.map(convertDocData)
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  },

  async getOrderById(id) {
    try {
      const docRef = doc(db, COLLECTIONS.orders, id)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? convertDocData(docSnap) : null
    } catch (error) {
      console.error('Error fetching order:', error)
      return null
    }
  },

  async createOrder(data) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.orders), {
        ...data,
        createdAt: Timestamp.now(),
      })
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  async updateOrder(id, data) {
    try {
      const docRef = doc(db, COLLECTIONS.orders, id)
      await updateDoc(docRef, data)
      return { id, ...data }
    } catch (error) {
      console.error('Error updating order:', error)
      throw error
    }
  },

  async deleteOrder(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.orders, id))
      return true
    } catch (error) {
      console.error('Error deleting order:', error)
      throw error
    }
  },
}

// Sales Service
export const salesService = {
  async recordSale(data) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.sales), {
        ...data,
        createdAt: Timestamp.now(),
      })
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error('Error recording sale:', error)
      throw error
    }
  },

  async getSales(startDate, endDate) {
    try {
      const startTimestamp = Timestamp.fromDate(startDate)
      const endTimestamp = Timestamp.fromDate(endDate)
      
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTIONS.sales),
          where('createdAt', '>=', startTimestamp),
          where('createdAt', '<=', endTimestamp),
          orderBy('createdAt', 'desc')
        )
      )
      return querySnapshot.docs.map(convertDocData)
    } catch (error) {
      console.error('Error fetching sales:', error)
      return []
    }
  },

  async getDailySales(date) {
    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      
      const startTimestamp = Timestamp.fromDate(startOfDay)
      const endTimestamp = Timestamp.fromDate(endOfDay)
      
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTIONS.sales),
          where('createdAt', '>=', startTimestamp),
          where('createdAt', '<=', endTimestamp)
        )
      )
      return querySnapshot.docs.map(convertDocData)
    } catch (error) {
      console.error('Error fetching daily sales:', error)
      return []
    }
  },
}

// Log Service
export const logService = {
  async getAllLogs() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.logs), orderBy('timestamp', 'desc'))
      )
      return querySnapshot.docs.map(convertDocData)
    } catch (error) {
      console.error('Error fetching logs:', error)
      return []
    }
  },

  async createLog(data) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.logs), {
        ...data,
        timestamp: Timestamp.now(),
      })
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error('Error creating log:', error)
      return null
    }
  },
}
