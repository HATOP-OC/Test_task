import { Request, Response } from "express"
import * as bookService from "../services/book.service"

export async function list(_req: Request, res: Response) {
  const books = await bookService.listBooks()
  res.json({ books })
}

export async function getById(req: Request, res: Response) {
  const book = await bookService.getBookById(req.params.id)
  res.json({ book })
}

export async function create(req: Request, res: Response) {
  const book = await bookService.createBook(req.body)
  res.status(201).json({ book })
}

export async function update(req: Request, res: Response) {
  const book = await bookService.updateBook(req.params.id, req.body)
  res.json({ book })
}

export async function remove(req: Request, res: Response) {
  await bookService.deleteBook(req.params.id)
  res.status(204).send()
}
