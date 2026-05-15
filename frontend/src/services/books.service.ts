import api from "./api"
import type { Book } from "../types"

export interface BookInput {
  name: string
  author: string
  pageCount: number
}

export const booksService = {
  list: async (): Promise<Book[]> => (await api.get<{ books: Book[] }>("/books")).data.books,
  get: async (id: string): Promise<Book> => (await api.get<{ book: Book }>(`/books/${id}`)).data.book,
  create: async (input: BookInput): Promise<Book> =>
    (await api.post<{ book: Book }>("/books", input)).data.book,
  update: async (id: string, input: BookInput): Promise<Book> =>
    (await api.put<{ book: Book }>(`/books/${id}`, input)).data.book,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`)
  },
}
