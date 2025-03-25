import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

export default router;