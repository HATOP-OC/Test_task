import { Request, Response } from "express"
import * as userService from "../services/user.service"
import { AppError } from "../utils/AppError"

export async function list(_req: Request, res: Response) {
  const users = await userService.listUsers()
  res.json({ users })
}

export async function getById(req: Request, res: Response) {
  const user = await userService.getUserById(req.params.id)
  res.json({ user })
}

export async function create(req: Request, res: Response) {
  const user = await userService.createUser(req.body)
  res.status(201).json({ user })
}

export async function update(req: Request, res: Response) {
  const user = await userService.updateUser(req.params.id, req.body)
  res.json({ user })
}

export async function remove(req: Request, res: Response) {
  if (!req.user) throw AppError.unauthorized()
  await userService.deleteUser(req.params.id, req.user.id)
  res.status(204).send()
}
