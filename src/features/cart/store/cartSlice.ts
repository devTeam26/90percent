import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Cart, CartItem, Product, ProductVariant } from '@/types'
import { generateSessionId } from '@/lib/utils'

interface CartState {
  cart: Cart | null
  sessionId: string
  isLoading: boolean
  isSyncing: boolean
}

const initialState: CartState = {
  cart: null,
  sessionId: generateSessionId(),
  isLoading: false,
  isSyncing: false,
}

const recalculate = (items: CartItem[]) => {
  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0)
  return subtotal
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<Cart>) {
      state.cart = action.payload
    },
    addItem(
      state,
      action: PayloadAction<{
        product: Product
        variant?: ProductVariant
        quantity?: number
      }>
    ) {
      const { product, variant, quantity = 1 } = action.payload
      if (!state.cart) {
        state.cart = {
          id: `local_${Date.now()}`,
          sessionId: state.sessionId,
          items: [],
          subtotal: 0,
          discount: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }

      const existingIndex = state.cart.items.findIndex(
        (i) => i.productId === product.id && i.variantId === variant?.id
      )

      const price = variant?.price ?? product.price
      if (existingIndex >= 0) {
        state.cart.items[existingIndex].quantity += quantity
        state.cart.items[existingIndex].totalPrice =
          state.cart.items[existingIndex].quantity * price
      } else {
        state.cart.items.push({
          id: `item_${Date.now()}`,
          productId: product.id,
          product,
          variantId: variant?.id,
          variant,
          quantity,
          price,
          totalPrice: price * quantity,
        })
      }

      state.cart.subtotal = recalculate(state.cart.items)
      state.cart.total = state.cart.subtotal - state.cart.discount + state.cart.tax + state.cart.shipping
      state.cart.updatedAt = new Date().toISOString()
    },
    removeItem(state, action: PayloadAction<string>) {
      if (!state.cart) return
      state.cart.items = state.cart.items.filter((i) => i.id !== action.payload)
      state.cart.subtotal = recalculate(state.cart.items)
      state.cart.total = state.cart.subtotal - state.cart.discount + state.cart.tax + state.cart.shipping
    },
    updateQuantity(state, action: PayloadAction<{ itemId: string; quantity: number }>) {
      if (!state.cart) return
      const item = state.cart.items.find((i) => i.id === action.payload.itemId)
      if (item) {
        if (action.payload.quantity <= 0) {
          state.cart.items = state.cart.items.filter((i) => i.id !== action.payload.itemId)
        } else {
          item.quantity = action.payload.quantity
          item.totalPrice = item.price * item.quantity
        }
        state.cart.subtotal = recalculate(state.cart.items)
        state.cart.total = state.cart.subtotal - state.cart.discount + state.cart.tax + state.cart.shipping
      }
    },
    saveForLater(state, action: PayloadAction<string>) {
      if (!state.cart) return
      const item = state.cart.items.find((i) => i.id === action.payload)
      if (item) item.savedForLater = true
    },
    moveToCart(state, action: PayloadAction<string>) {
      if (!state.cart) return
      const item = state.cart.items.find((i) => i.id === action.payload)
      if (item) item.savedForLater = false
    },
    applyCoupon(state, action: PayloadAction<{ code: string; discount: number }>) {
      if (!state.cart) return
      state.cart.couponCode = action.payload.code
      state.cart.discount = action.payload.discount
      state.cart.total = state.cart.subtotal - state.cart.discount + state.cart.tax + state.cart.shipping
    },
    removeCoupon(state) {
      if (!state.cart) return
      state.cart.couponCode = undefined
      state.cart.coupon = undefined
      state.cart.discount = 0
      state.cart.total = state.cart.subtotal + state.cart.tax + state.cart.shipping
    },
    setShipping(state, action: PayloadAction<number>) {
      if (!state.cart) return
      state.cart.shipping = action.payload
      state.cart.total = state.cart.subtotal - state.cart.discount + state.cart.tax + state.cart.shipping
    },
    clearCart(state) {
      state.cart = null
    },
    setSyncing(state, action: PayloadAction<boolean>) {
      state.isSyncing = action.payload
    },
  },
})

export const {
  setCart,
  addItem,
  removeItem,
  updateQuantity,
  saveForLater,
  moveToCart,
  applyCoupon,
  removeCoupon,
  setShipping,
  clearCart,
  setSyncing,
} = cartSlice.actions

export default cartSlice.reducer
