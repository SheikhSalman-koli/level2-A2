import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const creatUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
     const hashedPassword = await bcrypt.hash(password as string, 10);
    const result = await pool.query(
            'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hashedPassword, phone, role]
        );

        delete result.rows[0].password; 

        return result
}


const loginUser = async (payload: Record<string, unknown>) => {
    const { email, password } = payload;

    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );      

    if (result.rows.length === 0) {
        return ({
            success: false,
            message: "User not found"   
        })
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password as string, user?.password);
    if (!isPasswordValid) {
       return ('Invalid password');
    }

    delete user.password;

    const jwtSign = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const token = jwt.sign(jwtSign, config.jwtSecret as string, { expiresIn: '1h' })

    return {
        user, token
    };
}



export const authServices = {
    creatUser,
    loginUser
}