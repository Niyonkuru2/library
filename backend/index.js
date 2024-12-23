import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import bookRouter from './routes/bookRoute.js'
import memberRouter from './routes/memberRoute.js'
import transactionRouter from './routes/transactionRoute.js'
import reservationRouter from './routes/reservationRoute.js'
import userRouter from './routes/userRoute.js'
import subscribeRouter from './routes/subscribe.js'

//app config

const app = express()
const port = process.env.PORT || 9000
connectDB()
connectCloudinary()

//middleware
app.use(express.json())
app.use(cors())

//use app
app.use('/api/book', bookRouter);
app.use('/api/member', memberRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/reservation',reservationRouter);
app.use('/api/subscribe',subscribeRouter);
app.use('/api/user',userRouter);

app.get('/',(req,res)=>{
    res.send('Express server is Running')
})
app.listen(port,()=>console.log("Server Started",port))