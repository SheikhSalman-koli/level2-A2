import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req?.body);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            user: result.rows[0]
        });
    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const bookingController = {
    createBooking
}