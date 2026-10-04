import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Order } from '@/types'

interface OrdersState {
  items: Order[]
}

const initialState: OrdersState = { items: [] }

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder(state, action: PayloadAction<Order>) {
      state.items.unshift(action.payload)
    },
  },
})

export const { placeOrder } = ordersSlice.actions
export default ordersSlice.reducer
