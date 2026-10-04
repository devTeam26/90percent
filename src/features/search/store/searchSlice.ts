import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { SearchFilters } from '@/types'

interface SearchState {
  query: string
  filters: SearchFilters
  history: string[]
  recentlyViewed: string[]
}

const initialState: SearchState = {
  query: '',
  filters: { sortBy: 'relevance', page: 1, limit: 24 },
  history: [],
  recentlyViewed: [],
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
    },
    setFilters(state, action: PayloadAction<Partial<SearchFilters> & { page?: number }>) {
      const { page, ...rest } = action.payload
      state.filters = { ...state.filters, ...rest, page: page ?? 1 }
    },
    resetFilters(state) {
      state.filters = { sortBy: 'relevance', page: 1, limit: 24 }
    },
    addToHistory(state, action: PayloadAction<string>) {
      if (!action.payload.trim()) return
      state.history = [
        action.payload,
        ...state.history.filter((h) => h !== action.payload),
      ].slice(0, 10)
    },
    clearHistory(state) {
      state.history = []
    },
    addToRecentlyViewed(state, action: PayloadAction<string>) {
      state.recentlyViewed = [
        action.payload,
        ...state.recentlyViewed.filter((id) => id !== action.payload),
      ].slice(0, 20)
    },
  },
})

export const { setQuery, setFilters, resetFilters, addToHistory, clearHistory, addToRecentlyViewed } =
  searchSlice.actions

export default searchSlice.reducer
