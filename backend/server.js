import express from "express";
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
const app=express()
app.use(cors())
app.use(express.json())
const connectDB = async()=>{

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB CONNECTED✅")
    } catch (err) {
        console.log("error while conncting to DB", err.message)
    }
}
connectDB();
app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
const PORT = process.env.PORT|| 3000
app.listen(PORT, ()=>{
    console.log(`server listening at port number: ${PORT}`)
})