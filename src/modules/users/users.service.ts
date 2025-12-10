import { pool } from "../../config/db";
import bcrypt from 'bcryptjs';

const getAllUser = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result;
}

const updateUser = async (payload: Record<string, unknown>, id: string | undefined) => {
  const { name, email, password, phone, role } = payload;

  let hashedPassword = null;
  
  if (password) {
    hashedPassword = await bcrypt.hash(password as string, 10);
  }

  const result = await pool.query(`
    UPDATE users SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        password = COALESCE($4, password),
        role = COALESCE($5, role)
    WHERE id = $6
    RETURNING *
  `, [name, email, phone, hashedPassword, role, id]);

  return result;
}


const deleteUser = async (id: string | undefined) => {

  const hasActiveBooking = await pool.query('SELECT COUNT(*) FROM bookings WHERE customer_id = $1 AND status = $2', [id, 'active']);

  if (parseInt(hasActiveBooking.rows[0].count) > 0) {
      throw new Error('Cannot delete user with active bookings.');
  }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result;
}

export const userServices = {
    getAllUser,
    updateUser,
    deleteUser
}

