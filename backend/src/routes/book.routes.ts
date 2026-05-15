import { Router } from "express"
import * as bookController from "../controllers/book.controller"
import { asyncHandler } from "../utils/asyncHandler"
import { validate } from "../middlewares/validate"
import { verifyTokenMiddleware, requireAdmin } from "../middlewares/auth"
import { createBookSchema, updateBookSchema } from "../schemas/book.schema"

const router = Router()

router.use(verifyTokenMiddleware)

router.get("/", asyncHandler(bookController.list))
router.get("/:id", asyncHandler(bookController.getById))

router.post("/", requireAdmin, validate(createBookSchema), asyncHandler(bookController.create))
router.put("/:id", requireAdmin, validate(updateBookSchema), asyncHandler(bookController.update))
router.delete("/:id", requireAdmin, asyncHandler(bookController.remove))

export default router
