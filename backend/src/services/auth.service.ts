import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import { prisma } from "../config/prisma"
import { signToken } from "../utils/jwt"
import { AppError } from "../utils/AppError"
import { SignupInput, LoginInput } from "../schemas/auth.schema"

const SALT_ROUNDS = 10

function toPublicUser(user: { id: string; name: string; email: string; role: Role }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw AppError.conflict("Email already registered")

  const hashed = await bcrypt.hash(input.password, SALT_ROUNDS)
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, password: hashed, role: Role.user },
  })

  const token = signToken({ sub: user.id, email: user.email, role: user.role })
  return { user: toPublicUser(user), token }
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw AppError.unauthorized("Invalid credentials")

  const ok = await bcrypt.compare(input.password, user.password)
  if (!ok) throw AppError.unauthorized("Invalid credentials")

  const token = signToken({ sub: user.id, email: user.email, role: user.role })
  return { user: toPublicUser(user), token }
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw AppError.notFound("User not found")
  return toPublicUser(user)
}
