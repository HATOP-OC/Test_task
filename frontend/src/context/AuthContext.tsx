import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { authService } from "../services/auth.service"
import { TOKEN_KEY } from "../services/api"
import type { User } from "../types"

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  signup: (name: string, email: string, password: string) => Promise<User>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    authService
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await authService.login(email, password)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(user)
    return user
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { user, token } = await authService.signup(name, email, password)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      isAdmin: user?.role === "admin",
    }),
    [user, loading, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
