import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const verifyToken =(...roles: string[])=>{
    return async(req:Request, res:Response, next:NextFunction) => {

        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1] 
        if (!authHeader || !token) {
            return res.status(401).json({ message: "you are not alloewed!!" });
        }

        const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload

        const user = await  pool.query(`
            SELECT * FROM users WHERE id = $1
            `, [decoded?.id])

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "user not found!" });
        }

        req.user = decoded

        if(!roles.length){
            return res.status(403).json({ message: "please assign role!" });
        } 
        
        if (roles.length && !roles.includes(user.rows[0]?.role)) {
            return res.status(403).json({ message: "forbidden access!" });
        }

        next()
    }
}

export default verifyToken;