
import express, { Request, Response } from 'express'
import { Pool } from 'pg'
import bcrypt from "bcryptjs";
import config from './config';
import initDB, { pool } from './config/db';
import { userRouter } from './modules/users/users.routes';
import { vehicleRouter } from './modules/vehicles/vehicle.routes';

const app = express()
const port = config.port

app.use(express.json())



initDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World! i am learning typescript with nodejs. added watch mode, done')
})

app.post('/data', (req: Request, res: Response) => {
    console.log(req.body);

    res.status(200).json({ message: 'Data received successfully' });
})

// user router
app.use('/users', userRouter);

// vehicle router
app.use( "/api/v1/vehicles", vehicleRouter)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
