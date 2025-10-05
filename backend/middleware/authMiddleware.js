import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; // ✅ split by space
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password"); // ✅ fixed typo
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token found" }); // ✅ fixed typo
    }
  } catch (error) {
    res.status(401).json({
      message: "Token failed",
      error: error.message,
    });
  }
};
