import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔍 Search users by username
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(200).json([]);
    }

    const users = await User.find({
      username: { $regex: q, $options: "i" },
      _id: { $ne: req.userId },
    }).select("_id username");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: "User search failed",
      error: error.message
    });
  }
});

export default router;
