import { Router } from "express";
import { vehicleController } from "./vehicle.controller";

const router = Router();

router.post('/', vehicleController.createVehecle) 

export const vehicleRouter = router;