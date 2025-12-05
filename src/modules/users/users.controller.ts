import { Request, Response } from "express"
import { userServices } from "./users.service";

const getAllUser =async (req:Request, res: Response) => {
    try {
                const result = await userServices.getAllUser()
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

export const userController = {
    getAllUser
}