import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/types'

interface WishlistState {
  items: { productId: string; product: Product; addedAt: string }[]
}

const initialState: WishlistState = { items: [] }

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Product>) {
      const exists = state.items.some((i) => i.productId === action.payload.id)
      if (!exists) {
        state.items.push({
          productId: action.payload.id,
          product: action.payload,
          addedAt: new Date().toISOString(),
        })
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload)
    },
    clearWishlist(state) {
      state.items = []
    },
    syncWishlist(state, action: PayloadAction<WishlistState['items']>) {
      state.items = action.payload
    },
  },
})

export const { addToWishlist, removeFromWishlist, clearWishlist, syncWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
