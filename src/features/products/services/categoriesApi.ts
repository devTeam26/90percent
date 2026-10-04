import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Category, ApiResponse } from '@/types'

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL || '/api/v1'}` }),
  tagTypes: ['Category'],
  endpoints: (build) => ({
    getCategories: build.query<ApiResponse<Category[]>, void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    getCategory: build.query<ApiResponse<Category>, string>({
      query: (slug) => `/categories/${slug}`,
    }),
    createCategory: build.mutation<ApiResponse<Category>, Partial<Category>>({
      query: (body) => ({ url: '/admin/categories', method: 'POST', body }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: build.mutation<ApiResponse<Category>, { id: string; body: Partial<Category> }>({
      query: ({ id, body }) => ({ url: `/admin/categories/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: build.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Category'],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi
