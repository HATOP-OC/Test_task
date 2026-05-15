import { Request, Response, NextFunction } from "express"
import { ZodSchema } from "zod"

type Source = "body" | "query" | "params"

export function validate(schema: ZodSchema, source: Source = "body") {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req[source])
      
      req[source] = parsed
      
      next()
    } catch (error) {
      next(error)
    }
  }
}
