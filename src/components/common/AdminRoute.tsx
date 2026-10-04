import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }
  if (!user || !['admin', 'vendor', 'support'].includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
