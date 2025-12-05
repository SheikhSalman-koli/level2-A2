import { Router } from "express";
import { vehicleController } from "./vehicle.controller";

const router = Router();

router.post('/', vehicleController.createVehecle) 

router.get('/', vehicleController.getAllVehicles) 

export const vehicleRouter = router;