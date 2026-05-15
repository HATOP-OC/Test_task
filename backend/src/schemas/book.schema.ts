import { z } from "zod"

export const createBookSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  author: z.string().trim().min(1, "Author is required"),
  pageCount: z.coerce.number().int().positive("pageCount must be a positive integer"),
})

export const updateBookSchema = createBookSchema.partial()

export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>
