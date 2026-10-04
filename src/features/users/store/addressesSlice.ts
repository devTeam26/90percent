import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Address } from '@/types'

interface AddressesState {
  items: Address[]
}

const initialState: AddressesState = { items: [] }

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Omit<Address, 'id' | 'userId' | 'createdAt'>>) {
      const newAddress: Address = {
        ...action.payload,
        id: `addr_${Date.now()}`,
        userId: 'mock-user',
        createdAt: new Date().toISOString(),
      }
      if (newAddress.isDefault) {
        state.items.forEach((a) => { a.isDefault = false })
      }
      if (state.items.length === 0) newAddress.isDefault = true
      state.items.push(newAddress)
    },
    updateAddress(state, action: PayloadAction<{ id: string; body: Partial<Address> }>) {
      const idx = state.items.findIndex((a) => a.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload.body }
    },
    deleteAddress(state, action: PayloadAction<string>) {
      const wasDefault = state.items.find((a) => a.id === action.payload)?.isDefault
      state.items = state.items.filter((a) => a.id !== action.payload)
      if (wasDefault && state.items.length > 0) state.items[0].isDefault = true
    },
    setDefaultAddress(state, action: PayloadAction<string>) {
      state.items.forEach((a) => { a.isDefault = a.id === action.payload })
    },
  },
})

export const { addAddress, updateAddress, deleteAddress, setDefaultAddress } = addressesSlice.actions
export default addressesSlice.reducer
