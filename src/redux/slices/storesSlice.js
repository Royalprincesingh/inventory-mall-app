import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  stores: [],
  loading: false,
  error: null,
}

const storesSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    setStores: (state, action) => {
      state.stores = action.payload
    },
    addStore: (state, action) => {
      state.stores.push(action.payload)
    },
    updateStore: (state, action) => {
      const index = state.stores.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.stores[index] = action.payload
      }
    },
    deleteStore: (state, action) => {
      state.stores = state.stores.filter(s => s.id !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setStores, addStore, updateStore, deleteStore, setLoading, setError } = storesSlice.actions
export default storesSlice.reducer
