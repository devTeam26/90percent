import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Notification } from '@/types'

interface NotificationsState {
  items: Notification[]
  unreadCount: number
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload
      state.unreadCount = action.payload.filter((n) => !n.isRead).length
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload)
      if (!action.payload.isRead) state.unreadCount++
    },
    markAsRead(state, action: PayloadAction<string>) {
      const n = state.items.find((i) => i.id === action.payload)
      if (n && !n.isRead) {
        n.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead(state) {
      state.items.forEach((n) => (n.isRead = true))
      state.unreadCount = 0
    },
    removeNotification(state, action: PayloadAction<string>) {
      const idx = state.items.findIndex((i) => i.id === action.payload)
      if (idx !== -1) {
        if (!state.items[idx].isRead) state.unreadCount--
        state.items.splice(idx, 1)
      }
    },
  },
})

export const { setNotifications, addNotification, markAsRead, markAllAsRead, removeNotification } =
  notificationsSlice.actions

export default notificationsSlice.reducer
