import { Request, Response, Router } from "express";
import { userController } from "./users.controller";

const router = Router()

router.post( "/" , userController.creatUser);

export const userRouter = router;