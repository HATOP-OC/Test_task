import { Router } from "express"
import * as userController from "../controllers/user.controller"
import { asyncHandler } from "../utils/asyncHandler"
import { validate } from "../middlewares/validate"
import { verifyTokenMiddleware, requireAdmin } from "../middlewares/auth"
import { createUserSchema, updateUserSchema } from "../schemas/user.schema"

const router = Router()

router.use(verifyTokenMiddleware, requireAdmin)

router.get("/", asyncHandler(userController.list))
router.get("/:id", asyncHandler(userController.getById))
router.post("/", validate(createUserSchema), asyncHandler(userController.create))
router.put("/:id", validate(updateUserSchema), asyncHandler(userController.update))
router.delete("/:id", asyncHandler(userController.remove))

export default router
