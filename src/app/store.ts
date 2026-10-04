import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from '@/features/auth/store/authSlice'
import cartReducer from '@/features/cart/store/cartSlice'
import wishlistReducer from '@/features/wishlist/store/wishlistSlice'
import addressesReducer from '@/features/users/store/addressesSlice'
import ordersReducer from '@/features/orders/store/ordersSlice'
import uiReducer from '@/features/ui/store/uiSlice'
import searchReducer from '@/features/search/store/searchSlice'
import notificationsReducer from '@/features/notifications/store/notificationsSlice'

import { authApi } from '@/features/auth/services/authApi'
import { productsApi } from '@/features/products/services/productsApi'
import { ordersApi } from '@/features/orders/services/ordersApi'
import { usersApi } from '@/features/users/services/usersApi'
import { categoriesApi } from '@/features/products/services/categoriesApi'
import { brandsApi } from '@/features/products/services/brandsApi'
import { reviewsApi } from '@/features/reviews/services/reviewsApi'
import { couponsApi } from '@/features/coupons/services/couponsApi'
import { notificationsApi } from '@/features/notifications/services/notificationsApi'
import { supportApi } from '@/features/support/services/supportApi'
import { analyticsApi } from '@/features/admin/services/analyticsApi'
import { paymentsApi } from '@/features/payments/services/paymentsApi'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'wishlist', 'addresses', 'orders'],
}

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  addresses: addressesReducer,
  orders: ordersReducer,
  ui: uiReducer,
  search: searchReducer,
  notifications: notificationsReducer,
  [authApi.reducerPath]: authApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [brandsApi.reducerPath]: brandsApi.reducer,
  [reviewsApi.reducerPath]: reviewsApi.reducer,
  [couponsApi.reducerPath]: couponsApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
  [supportApi.reducerPath]: supportApi.reducer,
  [analyticsApi.reducerPath]: analyticsApi.reducer,
  [paymentsApi.reducerPath]: paymentsApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      productsApi.middleware,
      ordersApi.middleware,
      usersApi.middleware,
      categoriesApi.middleware,
      brandsApi.middleware,
      reviewsApi.middleware,
      couponsApi.middleware,
      notificationsApi.middleware,
      supportApi.middleware,
      analyticsApi.middleware,
      paymentsApi.middleware,
    ),
  devTools: import.meta.env.DEV,
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
