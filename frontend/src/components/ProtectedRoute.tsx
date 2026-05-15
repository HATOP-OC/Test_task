import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AccessDenied from "../pages/AccessDenied"

interface Props {
  adminOnly?: boolean
}

export default function ProtectedRoute({ adminOnly = false }: Props) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">Loading...</div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (adminOnly && user.role !== "admin") {
    return <AccessDenied />
  }

  return <Outlet />
}
