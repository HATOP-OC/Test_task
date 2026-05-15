import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { usersService } from "../services/users.service"
import { extractErrorMessage } from "../services/api"
import type { Role } from "../types"

export default function UserForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("user")
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    usersService
      .get(id)
      .then((u) => {
        setName(u.name)
        setEmail(u.email)
        setRole(u.role)
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || (!isEdit && !password)) {
      setError("Name, email and password are required.")
      return
    }

    if (password && password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setError(null)
    setSubmitting(true)
    
    try {
      if (isEdit && id) {
        await usersService.update(id, {
          name: name.trim(),
          email: email.trim(),
          role,
          ...(password ? { password } : {}),
        })
      } else {
        await usersService.create({ 
          name: name.trim(), 
          email: email.trim(), 
          password, 
          role 
        })
      }
      navigate("/users", { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading...</p>

  return (
    <section>
      <Link
        to="/users"
        className="mb-6 inline-block text-sm text-slate-500 hover:text-slate-900"
      >
        ← Back to users
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">
          {isEdit ? "Edit user" : "New user"}
        </h1>

        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-medium uppercase text-slate-600">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium uppercase text-slate-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium uppercase text-slate-600">
              Password {isEdit && <span className="lowercase text-slate-400">(leave blank to keep)</span>}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="role" className="text-xs font-medium uppercase text-slate-600">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          {error && (
            <div className="col-span-full rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="col-span-full mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}