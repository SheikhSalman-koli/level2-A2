import corn from 'node-cron';
import { bookingServices } from '../modules/bookings/booking.service';
import { vehicleServices } from '../modules/vehicles/vehicle.service';

corn.schedule('1 0 * * *', async()=> {
//    console.log('run 12:01 am every day - auto return system');
    try {
        
      const expiredBookings = await bookingServices.getExpiredBookings(); 
      console.log(expiredBookings);

        for (const booking of expiredBookings) {
            await bookingServices.markBookingAsReturned(booking?.id);
            await vehicleServices.availabilityAfterExpired(booking?.vehicle_id);
        }

    } catch (error) {
        throw new Error("Auto return system failed.", {cause: error} );
    }
})