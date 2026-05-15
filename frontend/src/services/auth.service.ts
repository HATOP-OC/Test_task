import api from "./api"
import type { AuthResponse, User } from "../types"

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password })
    return data
  },
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/signup", { name, email, password })
    return data
  },
  me: async (): Promise<User> => {
    const { data } = await api.get<{ user: User }>("/auth/me")
    return data.user
  },
}
