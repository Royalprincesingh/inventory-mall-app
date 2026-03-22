import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  suppliers: [],
  loading: false,
  error: null,
}

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSuppliers: (state, action) => {
      state.suppliers = action.payload
    },
    addSupplier: (state, action) => {
      state.suppliers.push(action.payload)
    },
    updateSupplier: (state, action) => {
      const index = state.suppliers.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.suppliers[index] = action.payload
      }
    },
    deleteSupplier: (state, action) => {
      state.suppliers = state.suppliers.filter(s => s.id !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setSuppliers, addSupplier, updateSupplier, deleteSupplier, setLoading, setError } = suppliersSlice.actions
export default suppliersSlice.reducer
