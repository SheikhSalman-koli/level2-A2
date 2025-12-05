
import express, { Request, Response } from 'express'
import config from './config';
import initDB from './config/db';
import { userRouter } from './modules/users/users.routes';
import { vehicleRouter } from './modules/vehicles/vehicle.routes';
import { bookingRouter } from './modules/bookings/booking.routes';
import { authRouter } from './modules/auth/auth.routes';

const app = express()
const port = config.port

app.use(express.json())


initDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World! i am learning typescript with nodejs. added watch mode, done')
})


//auth routes
app.use("/api/v1/auth", authRouter)

// user router
app.use('/api/v1/users', userRouter);

// vehicle router
app.use( "/api/v1/vehicles", vehicleRouter)

// booking router
app.use( "/api/v1/bookings", bookingRouter)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
