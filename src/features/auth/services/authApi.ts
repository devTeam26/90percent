import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import type { User, AuthTokens, LoginPayload, RegisterPayload, ApiResponse } from '@/types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || '/api/v1'}/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (build) => ({
    login: build.mutation<ApiResponse<{ user: User } & AuthTokens>, LoginPayload>({
      query: (body) => ({ url: '/login', method: 'POST', body }),
    }),
    register: build.mutation<ApiResponse<{ user: User } & AuthTokens>, RegisterPayload>({
      query: (body) => ({ url: '/register', method: 'POST', body }),
    }),
    logout: build.mutation<ApiResponse<null>, void>({
      query: () => ({ url: '/logout', method: 'POST' }),
    }),
    forgotPassword: build.mutation<ApiResponse<null>, { email: string }>({
      query: (body) => ({ url: '/forgot-password', method: 'POST', body }),
    }),
    resetPassword: build.mutation<
      ApiResponse<null>,
      { token: string; password: string; confirmPassword: string }
    >({
      query: (body) => ({ url: '/reset-password', method: 'POST', body }),
    }),
    verifyEmail: build.mutation<ApiResponse<null>, { token: string }>({
      query: (body) => ({ url: '/verify-email', method: 'POST', body }),
    }),
    resendVerification: build.mutation<ApiResponse<null>, { email: string }>({
      query: (body) => ({ url: '/resend-verification', method: 'POST', body }),
    }),
    refreshToken: build.mutation<ApiResponse<AuthTokens>, { refreshToken: string }>({
      query: (body) => ({ url: '/refresh', method: 'POST', body }),
    }),
    socialLogin: build.mutation<
      ApiResponse<{ user: User } & AuthTokens>,
      { provider: 'google' | 'facebook' | 'apple'; token: string }
    >({
      query: (body) => ({ url: '/social', method: 'POST', body }),
    }),
    getMe: build.query<ApiResponse<User>, void>({
      query: () => '/me',
    }),
    changePassword: build.mutation<
      ApiResponse<null>,
      { currentPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (body) => ({ url: '/change-password', method: 'PUT', body }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useSocialLoginMutation,
  useGetMeQuery,
  useChangePasswordMutation,
} = authApi
