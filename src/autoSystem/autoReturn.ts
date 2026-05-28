import cron from 'node-cron'; // 1. স্পেলিং ঠিক করা হয়েছে
import { bookingServices } from '../modules/bookings/booking.service';
import { vehicleServices } from '../modules/vehicles/vehicle.service';

// প্রতিদিন রাত ১২:০১ মিনিট = '1 0 * * *'
cron.schedule('1 0 * * *', async () => {
    // console.log('Running auto-return system at 12:01 AM...');
    
    try {
        const expiredBookings = await bookingServices.getExpiredBookings(); 

        if (!expiredBookings || expiredBookings.length === 0) {
            console.log('No expired bookings found today.');
            return;
        }

        // 2. update paralel by promise.all
        const updatePromises = expiredBookings.map(async (booking) => {
            if (booking?.id && booking?.vehicle_id) {
                return Promise.all([
                    bookingServices.markBookingAsReturned(booking.id),
                    vehicleServices.availabilityAfterExpired(booking.vehicle_id)
                ]);
            }
        });

        await Promise.all(updatePromises);
        // console.log(`Successfully processed ${expiredBookings.length} expired bookings.`);

    } catch (error) {
        console.error("Auto return system failed. Error details:", error);
    }
});