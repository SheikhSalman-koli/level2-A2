import { Router } from "express";
import { userController } from "./users.controller";

const router = Router()

router.get( "/" , userController.getAllUser);

export const userRouter = router;