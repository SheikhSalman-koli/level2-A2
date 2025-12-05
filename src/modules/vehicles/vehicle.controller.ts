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

export const vehicleController = {
    createVehecle
}