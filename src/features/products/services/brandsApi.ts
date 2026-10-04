import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Brand, ApiResponse } from '@/types'

export const brandsApi = createApi({
  reducerPath: 'brandsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL || '/api/v1'}` }),
  tagTypes: ['Brand'],
  endpoints: (build) => ({
    getBrands: build.query<ApiResponse<Brand[]>, void>({
      query: () => '/brands',
      providesTags: ['Brand'],
    }),
    getBrand: build.query<ApiResponse<Brand>, string>({
      query: (slug) => `/brands/${slug}`,
    }),
    createBrand: build.mutation<ApiResponse<Brand>, Partial<Brand>>({
      query: (body) => ({ url: '/admin/brands', method: 'POST', body }),
      invalidatesTags: ['Brand'],
    }),
    updateBrand: build.mutation<ApiResponse<Brand>, { id: string; body: Partial<Brand> }>({
      query: ({ id, body }) => ({ url: `/admin/brands/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Brand'],
    }),
    deleteBrand: build.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/brands/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Brand'],
    }),
  }),
})

export const {
  useGetBrandsQuery,
  useGetBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi
