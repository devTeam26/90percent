import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import type { Review, PaginatedResponse, ApiResponse } from '@/types'

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || '/api/v1'}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Review'],
  endpoints: (build) => ({
    getProductReviews: build.query<
      PaginatedResponse<Review>,
      { productId: string; page?: number; limit?: number; rating?: number }
    >({
      query: ({ productId, page = 1, limit = 10, rating }) =>
        `/products/${productId}/reviews?page=${page}&limit=${limit}${rating ? `&rating=${rating}` : ''}`,
      providesTags: (_r, _e, { productId }) => [{ type: 'Review', id: productId }],
    }),
    createReview: build.mutation<
      ApiResponse<Review>,
      { productId: string; rating: number; title: string; body: string; images?: string[] }
    >({
      query: ({ productId, ...body }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { productId }) => [{ type: 'Review', id: productId }],
    }),
    voteReview: build.mutation<
      ApiResponse<null>,
      { reviewId: string; vote: 'helpful' | 'not_helpful' }
    >({
      query: ({ reviewId, vote }) => ({
        url: `/reviews/${reviewId}/vote`,
        method: 'POST',
        body: { vote },
      }),
    }),
    adminGetReviews: build.query<
      PaginatedResponse<Review>,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 20, status }) =>
        `/admin/reviews?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
      providesTags: ['Review'],
    }),
    adminUpdateReview: build.mutation<
      ApiResponse<Review>,
      { id: string; status: string; adminReply?: string }
    >({
      query: ({ id, ...body }) => ({ url: `/admin/reviews/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Review'],
    }),
    deleteReview: build.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Review'],
    }),
  }),
})

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useVoteReviewMutation,
  useAdminGetReviewsQuery,
  useAdminUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi
