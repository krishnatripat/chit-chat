import express from "express";
import cors from "cors";
import "dotenv/config";
import { Server } from "socket.io";
import http from "http";
import { connectDB } from "./lib/db.mjs";
import userRouter from "./routes/userRoutes.mjs";
import messageRouter from "./routes/messageRoutes.mjs";

const app = express();
const server = http.createServer(app);
//soocket setup
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
// store online users
export const userSocketMap = {}

//socket connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(" client connected", userId);
  if (userId) userSocketMap[userId] = socket.id;
  ///emit online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap))
  io.emit("online-users", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("client disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap))


  })


});


app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.json("server is running"));
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)


await connectDB();



const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));



  
});
