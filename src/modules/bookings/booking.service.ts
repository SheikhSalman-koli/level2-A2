import { pool } from "../../config/db";


const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const vehicleData = await pool.query(`
        SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1
        `, [vehicle_id]
    )

    await pool.query(`
        UPDATE vehicles SET 
            availability_status = COALESCE($1, availability_status)
        WHERE id = $2
    `, ['booked', vehicle_id]);


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
            const { id, ...customerData } = customer;
            booking.customer = customerData;
        }
    });

    result.rows.forEach(booking => {
        booking.rent_start_date = new Date(booking.rent_start_date).toLocaleDateString('en-CA');
        booking.rent_end_date = new Date(booking.rent_end_date).toLocaleDateString('en-CA');
        const vehicle = vehiclesData.rows.find(c => c.id === booking.vehicle_id);
        if (vehicle) {
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


const cancelBooking = async (bookingId: string | undefined, payload: Record<string, unknown>) => {
    const { status } = payload;
    if (status !== 'cancelled') {
        throw new Error("Invalid status update. Customer can only cancel the booking.");
    }

    const rentStartDate = await pool.query(`
        SELECT rent_start_date FROM bookings WHERE id = $1
    `, [bookingId]);
    const currentDate = new Date();
    const startDate = new Date(rentStartDate.rows[0].rent_start_date);
    if (currentDate >= startDate) {
        throw new Error("Booking cannot be cancelled on or after the rent start date.");
    }

    const result = await pool.query(`
        UPDATE bookings SET 
            status = COALESCE($1, status)
        WHERE id = $2
        RETURNING *
    `, [status, bookingId]);

 await pool.query(`
        UPDATE vehicles SET 
            availability_status = COALESCE($1, availability_status)
        WHERE id =$2
        RETURNING *
    `, ['available', result.rows[0].vehicle_id]);

    return result;
}

const returnedBooking = async (bookingId: string | undefined, payload: Record<string, unknown>) => {
    const { status } = payload;
    if (status !== 'returned') {
        throw new Error("Invalid status update. Admin can only mark the booking as returned.");
    }

    const result = await pool.query(`
        UPDATE bookings SET 
            status = COALESCE($1, status)
        WHERE id = $2
        RETURNING *
    `, [status, bookingId]);


    const updateVahecleAvailability = await pool.query(`
        UPDATE vehicles SET 
            availability_status = COALESCE($1, availability_status)
        WHERE id =$2
        RETURNING *
    `, ['available', result.rows[0].vehicle_id]);

    // result.rows[0].vehicle = updateVahecleAvailability.rows[0].availability_status;
    // console.log(updateVahecleAvailability.rows);

    const finalResult = {
        ...result.rows[0],
        vehicle: {
           availability_status: updateVahecleAvailability.rows[0].availability_status
        }
    }

    return finalResult;
}


const getExpiredBookings = async () => {
    const result = await pool.query(`
        SELECT * FROM bookings 
        WHERE rent_end_date < CURRENT_DATE
        AND status != 'returned'
    `);
    return result.rows;
}

const markBookingAsReturned = async (bookingId: number|undefined) => {
    await pool.query(`
        UPDATE bookings SET 
            status = COALESCE($1, status)
        WHERE id = $2
    `, ['returned',bookingId]);

}




export const bookingServices = {
    createBooking,
    getAllBookings,
    getCustomerBookings,
    cancelBooking,
    returnedBooking,
    getExpiredBookings,
    markBookingAsReturned
}