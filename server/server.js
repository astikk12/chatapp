import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import app from "./app.js";
import connectDB from "./config/db.js";
import Message from "./models/Message.js";

dotenv.config();

// ✅ DB
connectDB();

const server = http.createServer(app);

// ✅ Socket Server
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ Online Users Map
// userId -> socketId
const onlineUsers = new Map();


// ✅ Socket Authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.userId = decoded.userId;

    next();
  } catch (error) {
    next(new Error("Invalid Token"));
  }
});


// ✅ Socket Connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  // store online user
  onlineUsers.set(
    socket.userId,
    socket.id
  );

  // ✅ Send Message
  socket.on("send_message", async (data) => {
    try {
      const { receiverId, message } = data;

      // save message
      const newMessage =
        await Message.create({
          senderId: socket.userId,
          receiverId,
          message,
        });

      // receiver socket
      const receiverSocket =
        onlineUsers.get(receiverId);

      // send to receiver only
      if (receiverSocket) {
        io.to(receiverSocket).emit(
          "receive_message",
          newMessage
        );
      }

      // send back to sender
      socket.emit(
        "receive_message",
        newMessage
      );

    } catch (error) {
      console.error(
        "Message error:",
        error
      );
    }
  });

  // ✅ Disconnect
  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.userId
    );

    onlineUsers.delete(
      socket.userId
    );
  });
});


// ✅ Server Start
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} 🚀`
  );
});