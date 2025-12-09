import { Request, Response } from "express"
import { vehicleServices } from "./vehicle.service";

const createVehecle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.createVehecle(req?.body);
        res.status(201).json({
            success: true,
            message: 'Vehicle created successfully',
            data: result.rows[0]
        });
    } catch (err:any) {
            res.status(500).json({
            success: false,
            message: "Failed to create vehicle",
            error: err.message
        })
    }
}


const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getAllvehicles()
        res.status(201).json({
            success: true,
            message: result.rows.length === 0 ? "No vehicles found" : "Vehicles retrieved successfully",
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


const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getSinglevehicle(req.params.vehicleId)
        res.status(201).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0]
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve vehicle",
            error: err.message
        })
    }
}


const updateVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.updateVehicle(req?.params.vehicleId, req?.body); 
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result.rows[0]
        });
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Failed to update vehicle",
            error: err.message
        });
    }
}


const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.deleteVehicle(req?.params.vehicleId);
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete vehicle",
            error: err.message
        });
    }
}



export const vehicleController = {
    createVehecle,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
}