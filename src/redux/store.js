import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import inventoryReducer from './slices/inventorySlice'
import storesReducer from './slices/storesSlice'
import suppliersReducer from './slices/suppliersSlice'
import ordersReducer from './slices/ordersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    stores: storesReducer,
    suppliers: suppliersReducer,
    orders: ordersReducer,
  },
})

export default store
