import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import type { Product, PaginatedResponse, ApiResponse, SearchFilters } from '@/types'
import { buildQueryString } from '@/lib/utils'

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || '/api/v1'}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Product', 'Products'],
  endpoints: (build) => ({
    getProducts: build.query<PaginatedResponse<Product>, SearchFilters>({
      query: (filters) => `/products?${buildQueryString(filters as Record<string, unknown>)}`,
      providesTags: ['Products'],
    }),
    getProduct: build.query<ApiResponse<Product>, string>({
      query: (slugOrId) => `/products/${slugOrId}`,
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
    }),
    getFeaturedProducts: build.query<ApiResponse<Product[]>, void>({
      query: () => '/products/featured',
    }),
    getRelatedProducts: build.query<ApiResponse<Product[]>, string>({
      query: (productId) => `/products/${productId}/related`,
    }),
    getRecentlyViewed: build.query<ApiResponse<Product[]>, string[]>({
      query: (ids) => `/products/batch?ids=${ids.join(',')}`,
    }),
    createProduct: build.mutation<ApiResponse<Product>, Partial<Product>>({
      query: (body) => ({ url: '/admin/products', method: 'POST', body }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: build.mutation<ApiResponse<Product>, { id: string; body: Partial<Product> }>({
      query: ({ id, body }) => ({ url: `/admin/products/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Product', id }, 'Products'],
    }),
    deleteProduct: build.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImages: build.mutation<ApiResponse<{ urls: string[] }>, { id: string; files: FormData }>({
      query: ({ id, files }) => ({
        url: `/admin/products/${id}/images`,
        method: 'POST',
        body: files,
      }),
    }),
    getBestsellers: build.query<ApiResponse<Product[]>, { limit?: number }>({
      query: ({ limit = 10 }) => `/products/bestsellers?limit=${limit}`,
    }),
    getNewArrivals: build.query<ApiResponse<Product[]>, { limit?: number }>({
      query: ({ limit = 10 }) => `/products/new-arrivals?limit=${limit}`,
    }),
    searchSuggestions: build.query<ApiResponse<{ suggestions: string[] }>, string>({
      query: (q) => `/products/suggestions?q=${encodeURIComponent(q)}`,
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetFeaturedProductsQuery,
  useGetRelatedProductsQuery,
  useGetRecentlyViewedQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
  useGetBestsellersQuery,
  useGetNewArrivalsQuery,
  useSearchSuggestionsQuery,
} = productsApi
