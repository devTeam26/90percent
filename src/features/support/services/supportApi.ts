import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import type { SupportTicket, PaginatedResponse, ApiResponse } from '@/types'

export const supportApi = createApi({
  reducerPath: 'supportApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || '/api/v1'}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Ticket'],
  endpoints: (build) => ({
    getTickets: build.query<PaginatedResponse<SupportTicket>, { page?: number; status?: string }>({
      query: ({ page = 1, status }) =>
        `/support/tickets?page=${page}&limit=10${status ? `&status=${status}` : ''}`,
      providesTags: ['Ticket'],
    }),
    getTicket: build.query<ApiResponse<SupportTicket>, string>({
      query: (id) => `/support/tickets/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Ticket', id }],
    }),
    createTicket: build.mutation<
      ApiResponse<SupportTicket>,
      { subject: string; description: string; category: string; orderId?: string }
    >({
      query: (body) => ({ url: '/support/tickets', method: 'POST', body }),
      invalidatesTags: ['Ticket'],
    }),
    replyToTicket: build.mutation<
      ApiResponse<SupportTicket>,
      { id: string; message: string; attachments?: string[] }
    >({
      query: ({ id, ...body }) => ({ url: `/support/tickets/${id}/reply`, method: 'POST', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Ticket', id }],
    }),
    closeTicket: build.mutation<ApiResponse<SupportTicket>, string>({
      query: (id) => ({ url: `/support/tickets/${id}/close`, method: 'PUT' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Ticket', id }, 'Ticket'],
    }),
    // Admin
    adminGetTickets: build.query<
      PaginatedResponse<SupportTicket>,
      { page?: number; status?: string; priority?: string; search?: string }
    >({
      query: ({ page = 1, status, priority, search }) =>
        `/admin/support/tickets?page=${page}&limit=20${status ? `&status=${status}` : ''}${priority ? `&priority=${priority}` : ''}${search ? `&search=${search}` : ''}`,
      providesTags: ['Ticket'],
    }),
    assignTicket: build.mutation<ApiResponse<SupportTicket>, { id: string; agentId: string }>({
      query: ({ id, agentId }) => ({
        url: `/admin/support/tickets/${id}/assign`,
        method: 'PUT',
        body: { agentId },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Ticket', id }],
    }),
  }),
})

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useReplyToTicketMutation,
  useCloseTicketMutation,
  useAdminGetTicketsQuery,
  useAssignTicketMutation,
} = supportApi
