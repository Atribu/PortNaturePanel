import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Kayıt
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, departman } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Bu email zaten kayıtlı" });

    const newUser = new User({ name, email, password, departman });
    await newUser.save();

    res.status(201).json({ message: "Kayıt başarılı" });
  } catch (err) {
    console.error("🔥 Kayıt hatası:", err);
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

// Giriş
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Kullanıcı bulunamadı" });

    // Şifreyi hash'lemediğimiz için doğrudan karşılaştırıyoruz:
    if (user.password !== password) {
      return res.status(400).json({ message: "Şifre yanlış" });
    }

    // Token oluştur
    const token = jwt.sign(
      { id: user._id, role: user.role }, // payload
      process.env.JWT_SECRET,            // gizli anahtar
      { expiresIn: "7d" }                // süresi
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        departman: user.departman,
      },
    });
  } catch (err) {
    console.error("🔥 Giriş hatası:", err);
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

export default router;