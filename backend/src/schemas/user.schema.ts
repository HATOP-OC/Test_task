import { z } from "zod"
import { Role } from "@prisma/client"

export const createUserSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role).optional(),
})

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(Role).optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
