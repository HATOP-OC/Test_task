import { Request, Response, NextFunction } from "express"
import { Role } from "@prisma/client"
import { verifyToken } from "../utils/jwt"
import { AppError } from "../utils/AppError"

export function verifyTokenMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header || !header.startsWith("Bearer ")) {
    throw AppError.unauthorized("Missing or malformed Authorization header")
  }

  const token = header.slice("Bearer ".length).trim()
  if (!token) {
    throw AppError.unauthorized("Missing access token")
  }

  try {
    const payload = verifyToken(token)
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    }
    next()
  } catch {
    throw AppError.unauthorized("Invalid or expired token")
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required")
    }
    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden("Insufficient permissions")
    }
    next()
  }
}

export const requireAdmin = requireRole(Role.admin)
