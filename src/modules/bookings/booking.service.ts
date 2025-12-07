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


const getAllBookings = async () => {
    const result = await pool.query('SELECT * FROM bookings');

    const customerIds = result.rows.map(booking => booking.customer_id);

    const vehicleIds = result.rows.map(booking => booking.vehicle_id);

    const customersData = await pool.query(
        `SELECT id, name, email FROM users WHERE id = ANY($1::int[])`,
        [customerIds]
    );

    const vehiclesData = await pool.query(
        `SELECT id, vehicle_name, registration_number FROM vehicles WHERE id = ANY($1::int[])`,
        [vehicleIds]
    );

    result.rows.forEach(booking => {
        booking.rent_start_date = new Date(booking.rent_start_date).toLocaleDateString('en-CA');
        booking.rent_end_date = new Date(booking.rent_end_date).toLocaleDateString('en-CA');
        const customer = customersData.rows.find(c => c.id === booking.customer_id);
        if (customer) {
            // clone object so original stays intact
            const { id, ...customerData } = customer;
            booking.customer = customerData;
        }
    });

    result.rows.forEach(booking => {
        booking.rent_start_date = new Date(booking.rent_start_date).toLocaleDateString('en-CA');
        booking.rent_end_date = new Date(booking.rent_end_date).toLocaleDateString('en-CA');
        const vehicle = vehiclesData.rows.find(c => c.id === booking.vehicle_id);
        if (vehicle) {
            // clone object so original stays intact
            const { id, ...vehicleData } = vehicle;
            booking.vehicle = vehicleData;
        }
    });

    return result;
}


const getCustomerBookings = async (customerId: string) => {
    const BookingsResult = await pool.query('SELECT * FROM bookings WHERE customer_id = $1', [customerId]);

    const vehicleIds = BookingsResult.rows.map(booking => booking.vehicle_id);

    const bookingVehecles = await pool.query(
        `SELECT id, vehicle_name, registration_number, type FROM vehicles WHERE id = ANY($1::int[])`,
        [vehicleIds]
    );

    const cutomerbookings = BookingsResult.rows;

    cutomerbookings.forEach(booking => {
        booking.rent_start_date = new Date(booking.rent_start_date).toLocaleDateString('en-CA');
        booking.rent_end_date = new Date(booking.rent_end_date).toLocaleDateString('en-CA');
        const vehicle = bookingVehecles.rows.find(v => v.id === booking.vehicle_id);
        delete vehicle?.id;
        booking.vehicle = vehicle;
    });

    return cutomerbookings
}



export const bookingServices = {
    createBooking,
    getAllBookings,
    getCustomerBookings
}