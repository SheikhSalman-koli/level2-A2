import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()

router.post("/signup", authController.creatUser)

router.get("/signin", authController.loginUser);

export const authRouter = router;