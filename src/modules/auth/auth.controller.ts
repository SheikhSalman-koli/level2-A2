import { Request, Response } from "express";
import { authServices } from "./auth.service";

const creatUser = async (req: Request, res: Response) => {

    try {
        const result = await authServices.creatUser(req?.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: err.message
        });
    }
}


const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authServices.loginUser(req?.body);

        if (result === 'Invalid password') {
            return res.status(401).json({
                success: false, 
                message: "Invalid password"
            });
        }

        if (result.success === false) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Failed to login user",
            error: err.message
        });
    }
}

export const authController = {
    creatUser,
    loginUser
}