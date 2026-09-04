import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { getCurrentRole, type Role } from '../lib/permissions'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: Role[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles) {
    const role = getCurrentRole()
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}