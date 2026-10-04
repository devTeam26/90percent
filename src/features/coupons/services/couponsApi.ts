import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import type { Coupon, PaginatedResponse, ApiResponse } from '@/types'

export const couponsApi = createApi({
  reducerPath: 'couponsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || '/api/v1'}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Coupon'],
  endpoints: (build) => ({
    validateCoupon: build.mutation<
      ApiResponse<{ coupon: Coupon; discount: number }>,
      { code: string; orderAmount: number }
    >({
      query: (body) => ({ url: '/coupons/validate', method: 'POST', body }),
    }),
    adminGetCoupons: build.query<PaginatedResponse<Coupon>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => `/admin/coupons?page=${page}&limit=${limit}`,
      providesTags: ['Coupon'],
    }),
    createCoupon: build.mutation<ApiResponse<Coupon>, Partial<Coupon>>({
      query: (body) => ({ url: '/admin/coupons', method: 'POST', body }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: build.mutation<ApiResponse<Coupon>, { id: string; body: Partial<Coupon> }>({
      query: ({ id, body }) => ({ url: `/admin/coupons/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: build.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/coupons/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Coupon'],
    }),
  }),
})

export const {
  useValidateCouponMutation,
  useAdminGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponsApi
