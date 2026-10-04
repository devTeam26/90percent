import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

export default function ProtectedRoute() {
  const { isAuthenticated } = useAppSelector((s) => s.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }
  return <Outlet />
}
