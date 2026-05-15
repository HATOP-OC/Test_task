import { Router } from "express"
import * as authController from "../controllers/auth.controller"
import { asyncHandler } from "../utils/asyncHandler"
import { validate } from "../middlewares/validate"
import { verifyTokenMiddleware } from "../middlewares/auth"
import { signupSchema, loginSchema } from "../schemas/auth.schema"

const router = Router()

router.post("/signup", validate(signupSchema), asyncHandler(authController.signup))
router.post("/login", validate(loginSchema), asyncHandler(authController.login))
router.get("/me", verifyTokenMiddleware, asyncHandler(authController.me))

export default router
