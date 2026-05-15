import { prisma } from "../config/prisma"
import { AppError } from "../utils/AppError"
import { CreateBookInput, UpdateBookInput } from "../schemas/book.schema"

export function listBooks() {
  return prisma.book.findMany({ orderBy: { createdAt: "desc" } })
}

export async function getBookById(id: string) {
  const book = await prisma.book.findUnique({ where: { id } })
  if (!book) throw AppError.notFound("Book not found")
  return book
}

export function createBook(input: CreateBookInput) {
  return prisma.book.create({ data: input })
}

export function updateBook(id: string, input: UpdateBookInput) {
  return prisma.book.update({ where: { id }, data: input })
}

export function deleteBook(id: string) {
  return prisma.book.delete({ where: { id } })
}

