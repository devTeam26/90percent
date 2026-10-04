import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Theme = 'light' | 'dark' | 'system'

interface UIState {
  theme: Theme
  sidebarOpen: boolean
  cartDrawerOpen: boolean
  searchOpen: boolean
  mobileMenuOpen: boolean
  compareProducts: string[]
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  cartDrawerOpen: false,
  searchOpen: false,
  mobileMenuOpen: false,
  compareProducts: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setCartDrawer: (state, action: PayloadAction<boolean>) => {
      state.cartDrawerOpen = action.payload
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload
    },
    setMobileMenu: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload
    },
    addToCompare: (state, action: PayloadAction<string>) => {
      if (state.compareProducts.length < 4 && !state.compareProducts.includes(action.payload)) {
        state.compareProducts.push(action.payload)
      }
    },
    removeFromCompare: (state, action: PayloadAction<string>) => {
      state.compareProducts = state.compareProducts.filter((id) => id !== action.payload)
    },
    clearCompare: (state) => {
      state.compareProducts = []
    },
  },
})

export const {
  setTheme,
  toggleSidebar,
  setCartDrawer,
  setSearchOpen,
  setMobileMenu,
  addToCompare,
  removeFromCompare,
  clearCompare,
} = uiSlice.actions

export default uiSlice.reducer
