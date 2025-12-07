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


export const bookingController = {
    createBooking
}