import express from "express";
import Message from "../models/Message.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// 📜 Get chat history
router.get("/:receiverId", auth, async (req, res) => {
  try {
    const { receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId },
        { senderId: receiverId, receiverId: req.userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message
    });
  }
});

export default router;