import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import { prisma } from "../config/prisma"
import { AppError } from "../utils/AppError"
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schema"

const SALT_ROUNDS = 10

const publicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const

export function listUsers() {
  return prisma.user.findMany({ select: publicSelect, orderBy: { createdAt: "desc" } })
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id }, select: publicSelect })
  if (!user) throw AppError.notFound("User not found")
  return user
}

export async function createUser(input: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw AppError.conflict("Email already registered")

  const hashed = await bcrypt.hash(input.password, SALT_ROUNDS)
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashed,
      role: input.role ?? Role.user,
    },
    select: publicSelect,
  })
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const data: Record<string, unknown> = { ...input }
  if (input.password) {
    data.password = await bcrypt.hash(input.password, SALT_ROUNDS)
  }
  return prisma.user.update({ where: { id }, data, select: publicSelect })
}

export async function deleteUser(id: string, currentUserId: string) {
  if (id === currentUserId) {
    throw AppError.badRequest("You cannot delete your own account")
  }
  return prisma.user.delete({ where: { id } })
}

