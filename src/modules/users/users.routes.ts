import { Router } from "express";
import { userController } from "./users.controller";
import verifyToken from "../../middleware/verifyToken";

const router = Router()

router.get( "/" , userController.getAllUser);

router.put( "/:userId", verifyToken('admin', 'customer') , userController.updateUser);

router.delete( "/:userId", verifyToken('customer') , userController.deleteUser)

export const userRouter = router;