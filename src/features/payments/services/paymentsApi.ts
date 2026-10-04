import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import type { PaymentIntent, ApiResponse, DeliveryMethod } from '@/types'

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || '/api/v1'}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (build) => ({
    createPaymentIntent: build.mutation<
      ApiResponse<PaymentIntent>,
      { amount: number; currency?: string; orderId?: string }
    >({
      query: (body) => ({ url: '/payments/stripe/intent', method: 'POST', body }),
    }),
    createPayPalOrder: build.mutation<
      ApiResponse<{ orderId: string; approvalUrl: string }>,
      { amount: number; currency?: string }
    >({
      query: (body) => ({ url: '/payments/paypal/order', method: 'POST', body }),
    }),
    capturePayPalOrder: build.mutation<ApiResponse<{ status: string }>, { paypalOrderId: string }>({
      query: (body) => ({ url: '/payments/paypal/capture', method: 'POST', body }),
    }),
    getDeliveryMethods: build.query<ApiResponse<DeliveryMethod[]>, { postalCode?: string; countryCode?: string }>({
      query: ({ postalCode, countryCode }) =>
        `/delivery-methods?${postalCode ? `postalCode=${postalCode}&` : ''}${countryCode ? `countryCode=${countryCode}` : ''}`,
    }),
    getWalletBalance: build.query<ApiResponse<{ balance: number; currency: string }>, void>({
      query: () => '/users/wallet',
    }),
    topUpWallet: build.mutation<ApiResponse<{ balance: number }>, { amount: number; paymentMethodId: string }>({
      query: (body) => ({ url: '/users/wallet/topup', method: 'POST', body }),
    }),
    getSavedPaymentMethods: build.query<
      ApiResponse<{ id: string; type: string; last4: string; brand: string; expMonth: number; expYear: number }[]>,
      void
    >({
      query: () => '/users/payment-methods',
    }),
    addPaymentMethod: build.mutation<ApiResponse<{ id: string }>, { paymentMethodId: string }>({
      query: (body) => ({ url: '/users/payment-methods', method: 'POST', body }),
    }),
    removePaymentMethod: build.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/users/payment-methods/${id}`, method: 'DELETE' }),
    }),
  }),
})

export const {
  useCreatePaymentIntentMutation,
  useCreatePayPalOrderMutation,
  useCapturePayPalOrderMutation,
  useGetDeliveryMethodsQuery,
  useGetWalletBalanceQuery,
  useTopUpWalletMutation,
  useGetSavedPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useRemovePaymentMethodMutation,
} = paymentsApi
