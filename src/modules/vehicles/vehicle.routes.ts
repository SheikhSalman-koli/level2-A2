import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import verifyToken from "../../middleware/verifyToken";

const router = Router();

router.post('/',verifyToken('admin'), vehicleController.createVehecle) 

router.get('/', vehicleController.getAllVehicles) 

router.get('/:vehicleId', vehicleController.getSingleVehicle)

router.put('/:vehicleId', vehicleController.updateVehicle)

router.delete('/:vehicleId', vehicleController.deleteVehicle)


export const vehicleRouter = router;