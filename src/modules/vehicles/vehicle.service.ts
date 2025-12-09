import { pool } from "../../config/db";

const createVehecle = async(payload: Record<string, unknown>) => {
    const { vehicle_name, type,  registration_number, daily_rent_price, availability_status } = payload;

    const result = await pool.query(
        'INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    return result
}

const getAllvehicles =async()=> {
    const result = await pool.query('SELECT * FROM vehicles');
    // const result: any = []
    return result
}


const getSinglevehicle =async(id: string | unknown)=> {
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result;
}


const updateVehicle = async(id: string | unknown, payload: Record<string, unknown>) => {
    const { vehicle_name, type,  registration_number, daily_rent_price, availability_status } = payload;            
    const result = await pool.query(
        'UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *',
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
    );
    return result;
}


const deleteVehicle = async(id: string | unknown) => {
    const result = await pool.query(
        'DELETE FROM vehicles WHERE id = $1 RETURNING *',   
        [id]
    );
    return result;
}


export const vehicleServices = {
    createVehecle,
    getAllvehicles,
    getSinglevehicle,
    updateVehicle,
    deleteVehicle
}