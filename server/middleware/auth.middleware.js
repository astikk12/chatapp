import jwt from "jsonwebtoken";
import "dotenv/config"
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ✅ attach user id
    req.userId = decoded.userId;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

export default authMiddleware;