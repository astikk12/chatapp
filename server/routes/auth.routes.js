import express from "express";
import {
  signup,
  login,
} from "../controllers/auth.controller.js";

const router = express.Router();

// ✅ REGISTER
router.post("/register", signup);

// ✅ LOGIN
router.post("/login", login);

export default router;