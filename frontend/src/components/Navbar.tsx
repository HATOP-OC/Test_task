import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
    }`

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <nav className="flex items-center gap-6">
          <NavLink to="/books" className={linkClass}>
            Books
          </NavLink>
          {isAdmin && (
            <NavLink to="/users" className={linkClass}>
              Users
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {user.role}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
