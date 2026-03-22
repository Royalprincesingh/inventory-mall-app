import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  categories: [],
  brands: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    category: null,
    brand: null,
    store: null,
    status: 'all', // all, low-stock, out-of-stock
  },
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload
    },
    addProduct: (state, action) => {
      state.products.push(action.payload)
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload)
    },
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setBrands: (state, action) => {
      state.brands = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setCategories,
  setBrands,
  setFilters,
  setLoading,
  setError,
} = inventorySlice.actions

export default inventorySlice.reducer
