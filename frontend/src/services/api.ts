import axios from "axios"

export const TOKEN_KEY = "token"

const API_URL = import.meta.env.VITE_API_URL ?? "/api"

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export default api

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return "An unexpected error occurred."
}
