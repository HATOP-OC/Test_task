import type { NextFunction, Request, Response } from "express"
import { Prisma } from "@prisma/client"
import { ZodError } from "zod"
import { AppError } from "../utils/AppError"

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404))
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Invalid request payload",
      details: err.flatten(),
    })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    })
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "ConflictError",
        message: "Unique constraint violation",
        details: err.meta,
      })
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        error: "NotFoundError",
        message: "Record not found",
      })
    }
    return res.status(400).json({
      error: "PrismaError",
      message: err.message,
      code: err.code,
    })
  }

  const message = err instanceof Error ? err.message : "Unknown error"
  console.error("[errorHandler] Unhandled error:", err)
  return res.status(500).json({
    error: "InternalServerError",
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : message,
  })
}
