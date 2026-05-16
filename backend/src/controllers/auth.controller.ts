import { Request, Response } from "express"
import * as authService from "../services/auth.service"
import { AppError } from "../utils/AppError"

export async function signup(req: Request, res: Response) {
  const result = await authService.signup(req.body)
  res.status(201).json(result)
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body)
  res.json(result)
}

export async function me(req: Request, res: Response) {
  if (!req.user) throw AppError.unauthorized()
  const user = await authService.getMe(req.user!.id)
  res.json({ user })
}
