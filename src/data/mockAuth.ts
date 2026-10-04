import type { User, AuthTokens } from '@/types'

interface MockCredential {
  email: string
  password: string
  user: User
}

const MOCK_CREDENTIALS: MockCredential[] = [
  {
    email: 'admin@90percent.com',
    password: 'Admin@123',
    user: {
      id: 'mock-admin-001',
      email: 'admin@90percent.com',
      firstName: 'Admin',
      lastName: '90percent',
      role: 'admin',
      permissions: [],
      isEmailVerified: true,
      isTwoFactorEnabled: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
  {
    email: 'customer@90percent.com',
    password: 'Customer@123',
    user: {
      id: 'mock-customer-001',
      email: 'customer@90percent.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'customer',
      permissions: [],
      isEmailVerified: true,
      isTwoFactorEnabled: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
]

export interface MockLoginResult {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export function mockLogin(email: string, password: string): MockLoginResult {
  const match = MOCK_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  )
  if (!match) {
    throw new Error('Invalid email or password')
  }
  const tokens: AuthTokens = {
    accessToken: `mock-access-${match.user.role}-${Date.now()}`,
    refreshToken: `mock-refresh-${match.user.role}-${Date.now()}`,
    expiresIn: 3600,
  }
  return { user: match.user, ...tokens }
}

export function isMockNetworkError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as Record<string, unknown>
  // Pure network failure (no proxy)
  if (e.status === 'FETCH_ERROR' || e.status === 'PARSING_ERROR') return true
  // Vite proxy returns 500/502/503/504 when backend is unreachable
  if (typeof e.status === 'number' && (e.status as number) >= 500) return true
  return false
}

export const MOCK_ACCOUNTS = MOCK_CREDENTIALS.map(({ email, password, user }) => ({
  email,
  password,
  role: user.role,
}))
