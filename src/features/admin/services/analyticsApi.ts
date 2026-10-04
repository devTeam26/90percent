import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import type { DashboardStats, SalesMetric, ApiResponse } from '@/types'

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || '/api/v1'}/admin`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (build) => ({
    getDashboardStats: build.query<ApiResponse<DashboardStats>, void>({
      query: () => '/analytics/dashboard',
    }),
    getSalesMetrics: build.query<
      ApiResponse<SalesMetric[]>,
      { period: 'day' | 'week' | 'month' | 'year'; from?: string; to?: string }
    >({
      query: ({ period, from, to }) =>
        `/analytics/sales?period=${period}${from ? `&from=${from}` : ''}${to ? `&to=${to}` : ''}`,
    }),
    getTopProducts: build.query<
      ApiResponse<{ productId: string; name: string; sales: number; revenue: number }[]>,
      { limit?: number }
    >({
      query: ({ limit = 10 }) => `/analytics/top-products?limit=${limit}`,
    }),
    getTopCategories: build.query<
      ApiResponse<{ categoryId: string; name: string; sales: number; revenue: number }[]>,
      { limit?: number }
    >({
      query: ({ limit = 10 }) => `/analytics/top-categories?limit=${limit}`,
    }),
    getCustomerMetrics: build.query<
      ApiResponse<{
        newCustomers: number
        returningCustomers: number
        customerLifetimeValue: number
        churnRate: number
      }>,
      { period: 'week' | 'month' | 'year' }
    >({
      query: ({ period }) => `/analytics/customers?period=${period}`,
    }),
    getConversionFunnel: build.query<
      ApiResponse<{ stage: string; count: number; conversionRate: number }[]>,
      void
    >({
      query: () => '/analytics/funnel',
    }),
    getInventoryReport: build.query<
      ApiResponse<{ lowStock: number; outOfStock: number; totalSkus: number }>,
      void
    >({
      query: () => '/analytics/inventory',
    }),
  }),
})

export const {
  useGetDashboardStatsQuery,
  useGetSalesMetricsQuery,
  useGetTopProductsQuery,
  useGetTopCategoriesQuery,
  useGetCustomerMetricsQuery,
  useGetConversionFunnelQuery,
  useGetInventoryReportQuery,
} = analyticsApi
