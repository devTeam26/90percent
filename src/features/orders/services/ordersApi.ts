import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import type { Order, PaginatedResponse, ApiResponse } from '@/types'

interface CreateOrderPayload {
  shippingAddressId: string
  billingAddressId?: string
  deliveryMethodId: string
  paymentMethod: string
  paymentIntentId?: string
  couponCode?: string
  notes?: string
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || '/api/v1'}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Order', 'Orders'],
  endpoints: (build) => ({
    getOrders: build.query<PaginatedResponse<Order>, { page?: number; limit?: number; status?: string }>({
      query: ({ page = 1, limit = 10, status }) =>
        `/orders?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
      providesTags: ['Orders'],
    }),
    getOrder: build.query<ApiResponse<Order>, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),
    createOrder: build.mutation<ApiResponse<Order>, CreateOrderPayload>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),
    cancelOrder: build.mutation<ApiResponse<Order>, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({ url: `/orders/${id}/cancel`, method: 'POST', body: { reason } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Order', id }, 'Orders'],
    }),
    requestReturn: build.mutation<
      ApiResponse<Order>,
      { id: string; items: { itemId: string; reason: string; quantity: number }[] }
    >({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/return`, method: 'POST', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Order', id }],
    }),
    trackOrder: build.query<ApiResponse<Order>, string>({
      query: (id) => `/orders/${id}/tracking`,
    }),
    // Admin endpoints
    adminGetOrders: build.query<
      PaginatedResponse<Order>,
      { page?: number; limit?: number; status?: string; search?: string }
    >({
      query: (params) => `/admin/orders?page=${params.page ?? 1}&limit=${params.limit ?? 20}${params.status ? `&status=${params.status}` : ''}${params.search ? `&search=${params.search}` : ''}`,
      providesTags: ['Orders'],
    }),
    updateOrderStatus: build.mutation<
      ApiResponse<Order>,
      { id: string; status: string; note?: string }
    >({
      query: ({ id, ...body }) => ({ url: `/admin/orders/${id}/status`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Order', id }, 'Orders'],
    }),
    processRefund: build.mutation<
      ApiResponse<Order>,
      { id: string; amount: number; reason: string }
    >({
      query: ({ id, ...body }) => ({ url: `/admin/orders/${id}/refund`, method: 'POST', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Order', id }],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useRequestReturnMutation,
  useTrackOrderQuery,
  useAdminGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useProcessRefundMutation,
} = ordersApi
