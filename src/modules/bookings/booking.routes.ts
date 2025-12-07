import { Router } from "express";
import { bookingController } from "./booking.controller";
import verifyToken from "../../middleware/verifyToken";

const router = Router();

router.post('/',verifyToken('admin', 'customer'), bookingController.createBooking)

router.get('/',verifyToken('admin', 'customer'), bookingController.getBookings)

export const bookingRouter = router;