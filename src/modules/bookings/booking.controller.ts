import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const {booking, vehicle} = await bookingServices.createBooking(req?.body);
        console.log();
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {...booking, vehicle}
        });
    } catch (err:any) {
        res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: err.message
        });
    }
}


const getBookings = async (req: Request, res: Response) => {
    try {
        const { role, id} = req.user as { role: string, id: string};
     
         let result: any;

        if(role === "admin"){
            result = await bookingServices.getAllBookings();
        } else if(role === "customer"){
            //customer can see only their bookings
            result = await bookingServices.getCustomerBookings(id);
        }
        
        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: role === "admin" ? result.rows : result
        });
    } catch (err:any) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve bookings",
            error: err.message
        });
    }
}




export const bookingController = {
    createBooking,
    getBookings
}