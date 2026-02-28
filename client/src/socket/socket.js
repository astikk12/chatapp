import { io } from "socket.io-client";
import { getToken } from "../utils/auth.js";

// socket instance
export const socket = io("http://localhost:5000", {
  autoConnect: false,
});

// ✅ connect socket
export const connectSocket = () => {
  socket.auth = {
    token: getToken(),
  };

  socket.connect();
};

// ✅ disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};