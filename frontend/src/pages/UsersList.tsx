import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { usersService } from "../services/users.service"
import { useAuth } from "../context/AuthContext"
import { extractErrorMessage } from "../services/api"
import type { User } from "../types"

export default function UsersList() {
  const { user: current } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      setUsers(await usersService.list())
      setError(null)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return
    try {
      await usersService.remove(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      alert(extractErrorMessage(err))
    }
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
        <Link
          to="/users/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + New user
        </Link>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link to={`/users/${u.id}`} className="hover:text-blue-600 hover:underline">
                      {u.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/users/${u.id}/edit`}
                        className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(u.id)}
                        disabled={u.id === current?.id}
                        title={u.id === current?.id ? "You can't delete yourself" : undefined}
                        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-40"
                      >
                        del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
