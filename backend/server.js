import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
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
app.use('/api/message',messageRoutes)
const PORT = process.env.PORT|| 3000
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    if (!user?._id) return;
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (chatId) => {
    if (chatId) socket.join(chatId);
  });

  socket.on("typing", ({ chatId, userId, name }) => {
    if (chatId) socket.in(chatId).emit("typing", { userId, name });
  });

  socket.on("stop typing", ({ chatId, userId }) => {
    if (chatId) socket.in(chatId).emit("stop typing", { userId });
  });

  socket.on("new message", (message) => {
    const recipients = message?.chat?.users;
    if (!Array.isArray(recipients)) return;

    recipients.forEach((recipient) => {
      if (recipient?._id?.toString() !== message.sender?._id?.toString()) {
        io.to(recipient._id.toString()).emit("message recieved", message);
      }
    });
  });
});

httpServer.listen(PORT, ()=>{
    console.log(`server listening at port number: ${PORT}`)
})
