import { Request, Response } from "express"
import { vehicleServices } from "./vehicle.service";

const createVehecle = async (req: Request, res: Response) => {
      try {
            const result = await vehicleServices.createVehecle(req?.body);
            res.status(201).json({
                success: true,
                message: 'Vehicle created successfully',
                user: result.rows[0]
            });
        } catch (err) {
            console.error('Error inserting user:', err);
            res.status(500).json({ error: 'Internal server error' });
        } 
}


const getAllVehicles =async (req:Request, res: Response) => {
    try {
                const result = await vehicleServices.getAllvehicles()
                res.status(201).json({
                    success: true,
                    message: "Vehicles retrieved successfully",
                    data: result.rows
                });
            } catch (err: any) {
                res.status(500).json({
            success: false,
            message: "Failed to retrieve vehicles",
            error: err.message
        })
            } 
}

export const vehicleController = {
    createVehecle,
    getAllVehicles
}