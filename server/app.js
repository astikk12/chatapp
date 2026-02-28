import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health Check Route (very useful)
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Global Error Handler (important)
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong",
  });
});

export default app;