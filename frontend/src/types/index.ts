export type Role = "user" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface Book {
  id: string
  name: string
  author: string
  pageCount: number
}

export interface AuthResponse {
  user: User
  token: string
}
