import { pool } from "../../config/db";


const createBooking = async (payload: Record<string, unknown>) => {

    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const vehicleData = await pool.query(`
        SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1
        `, [vehicle_id])

    const days = Math.ceil(
        (new Date(rent_end_date as string).getTime() - new Date(rent_start_date as string).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;  //for including end date

    const total_price = vehicleData.rows[0].daily_rent_price * days;

    const status = 'active';

    const result = await pool.query(
        'INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]
    );

const booking = result.rows[0];

  booking.rent_start_date = rent_start_date as string;
  booking.rent_end_date = rent_end_date as string;

    return ({
        booking,
        vehicle: vehicleData.rows[0]
    })

}

export const bookingServices = {
    createBooking
}