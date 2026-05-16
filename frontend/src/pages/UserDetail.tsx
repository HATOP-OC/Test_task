import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { usersService } from "../services/users.service"
import type { User } from "../types"

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      usersService.get(id)
        .then(setUser)
        .catch(() => setError("Failed to load user data"))
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return <div className="py-20 text-center text-sm text-slate-500">Loading user details...</div>
  }

  if (error || !user) {
    return (
      <div className="py-20 text-center text-sm text-red-500">
        {error || "User not found"}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">User Details</h1>
        <Link to="/users" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to users
        </Link>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <span className="block text-xs font-bold text-slate-700 tracking-wider">NAME</span>
          <p className="mt-1 text-base text-slate-900">{user.name}</p>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <span className="block text-xs font-bold text-slate-700 tracking-wider">EMAIL</span>
          <p className="mt-1 text-base text-slate-900">{user.email}</p>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <span className="block text-xs font-bold text-slate-700 tracking-wider">ROLE</span>
          <p className="mt-2">
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              user.role === "admin" 
                ? "bg-red-50 text-red-700 ring-red-600/10" 
                : "bg-blue-50 text-blue-700 ring-blue-700/10"
            }`}>
              {user.role}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <Link
          to={`/users/${id}/edit`}
          className="block w-full rounded-md bg-slate-900 py-2 text-center text-sm font-medium text-white hover:bg-slate-800"
        >
          Edit User
        </Link>
      </div>
    </div>
  )
}