// Firebase Service with Hybrid Approach
// Try real Firebase (Firestore) first, fallback to mock if not available

import * as realService from './firebaseRealService'
import * as mockService from './firebaseMockService'
import { db } from '../firebase'

// Check if Firebase is available
const useRealFirebase = !!db

// Wrapper function to try real service, fall back to mock
const createService = (serviceName) => {
  const realServiceObj = realService[serviceName]
  const mockServiceObj = mockService[serviceName]
  
  // If no real Firebase, use mock directly
  if (!useRealFirebase) {
    return mockServiceObj
  }
  
  // Otherwise, wrap each method to handle errors and fallback
  const wrappedService = {}
  
  // Get all method names from the real service
  Object.keys(realServiceObj).forEach(methodName => {
    wrappedService[methodName] = async (...args) => {
      try {
        return await realServiceObj[methodName](...args)
      } catch (error) {
        console.warn(`Real Firebase failed for ${serviceName}.${methodName}, using mock:`, error.message)
        // Fallback to mock service
        if (mockServiceObj[methodName]) {
          return await mockServiceObj[methodName](...args)
        }
        throw error
      }
    }
  })
  
  return wrappedService
}

// Create hybrid services
export const productService = createService('productService')
export const categoryService = createService('categoryService')
export const storeService = createService('storeService')
export const supplierService = createService('supplierService')
export const orderService = createService('orderService')
export const salesService = createService('salesService')
export const logService = createService('logService')
