import { Request, Response } from "express"
import { userServices } from "./users.service";

const getAllUser =async (req:Request, res: Response) => {
    try {
                const result = await userServices.getAllUser()
                res.status(200).json({
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


const updateUser = async(req:Request, res: Response) => {
    try {

        const {role, email} = req?.user as { role: string, email: string};
        let result : any;

        if(role === 'admin'){  
            result = await userServices.updateUsers(req?.body, req?.params.userId as string);
        }
        else if(role === 'customer' && req?.params.email === email){
            result = await userServices.updateProfile(req?.body, req?.params.userId as string);
        }else{
            throw new Error('You can only update your own profile.');
        }

         res.status(200).json({
                    success: true,
                    message: "User updated successfully",
                    data: result.rows[0]
                });
        
    } catch (err: any) {
         res.status(500).json({
            success: false,
            message: "Failed to update users",
            error: err.message
        })
    }   
}


const deleteUser = async(req:Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(req?.params.userId as string); 
            res.status(200).json({

                    success: true,
                    message: "User deleted successfully",
                });
    } catch (err: any) {
         res.status(500).json({
            success: false,
            message: "Failed to delete users",
            error: err.message
        })
    }
}


export const userController = {
    getAllUser,
    updateUser,
    deleteUser
}