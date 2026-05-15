import api from "./api"
import type { Role, User } from "../types"

export interface UserCreateInput {
  name: string
  email: string
  password: string
  role: Role
}

export interface UserUpdateInput {
  name?: string
  email?: string
  password?: string
  role?: Role
}

export const usersService = {
  list: async (): Promise<User[]> => (await api.get<{ users: User[] }>("/users")).data.users,
  get: async (id: string): Promise<User> => (await api.get<{ user: User }>(`/users/${id}`)).data.user,
  create: async (input: UserCreateInput): Promise<User> =>
    (await api.post<{ user: User }>("/users", input)).data.user,
  update: async (id: string, input: UserUpdateInput): Promise<User> =>
    (await api.put<{ user: User }>(`/users/${id}`, input)).data.user,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}
