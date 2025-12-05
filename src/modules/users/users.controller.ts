import { Request, Response } from "express"
import { userServices } from "./users.service";

const getAllUser =async (req:Request, res: Response) => {
    try {
                const result = await userServices.getAllUser()
                res.status(201).json({
                    success: true,
                    message: "Users retrieved successfully",
                    data: result.rows
                });
            } catch (err: any) {
                res.status(500).json({
            success: false,
            message: "Failed to retrieve users",
            error: err.message
        })
            } 
}

export const userController = {
    getAllUser
}