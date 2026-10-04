import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import type { User, Address, ApiResponse, PaginatedResponse } from '@/types'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || '/api/v1'}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['User', 'Address'],
  endpoints: (build) => ({
    updateProfile: build.mutation<ApiResponse<User>, Partial<User>>({
      query: (body) => ({ url: '/users/profile', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    uploadAvatar: build.mutation<ApiResponse<{ url: string }>, FormData>({
      query: (body) => ({ url: '/users/avatar', method: 'POST', body }),
    }),
    getAddresses: build.query<ApiResponse<Address[]>, void>({
      query: () => '/users/addresses',
      providesTags: ['Address'],
    }),
    addAddress: build.mutation<ApiResponse<Address>, Omit<Address, 'id' | 'userId' | 'createdAt'>>({
      query: (body) => ({ url: '/users/addresses', method: 'POST', body }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: build.mutation<ApiResponse<Address>, { id: string; body: Partial<Address> }>({
      query: ({ id, body }) => ({ url: `/users/addresses/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: build.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/users/addresses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Address'],
    }),
    setDefaultAddress: build.mutation<ApiResponse<Address>, string>({
      query: (id) => ({ url: `/users/addresses/${id}/default`, method: 'PUT' }),
      invalidatesTags: ['Address'],
    }),
    getNotificationPrefs: build.query<ApiResponse<Record<string, boolean>>, void>({
      query: () => '/users/notification-preferences',
    }),
    updateNotificationPrefs: build.mutation<
      ApiResponse<Record<string, boolean>>,
      Record<string, boolean>
    >({
      query: (body) => ({ url: '/users/notification-preferences', method: 'PUT', body }),
    }),
    // Admin endpoints
    adminGetUsers: build.query<
      PaginatedResponse<User>,
      { page?: number; limit?: number; search?: string; role?: string }
    >({
      query: ({ page = 1, limit = 20, search, role }) =>
        `/admin/users?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}${role ? `&role=${role}` : ''}`,
    }),
    adminUpdateUser: build.mutation<ApiResponse<User>, { id: string; body: Partial<User> }>({
      query: ({ id, body }) => ({ url: `/admin/users/${id}`, method: 'PUT', body }),
    }),
    adminDeleteUser: build.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
    }),
  }),
})

export const {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  useGetNotificationPrefsQuery,
  useUpdateNotificationPrefsMutation,
  useAdminGetUsersQuery,
  useAdminUpdateUserMutation,
  useAdminDeleteUserMutation,
} = usersApi
