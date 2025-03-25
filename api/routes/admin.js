import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import User from "../models/User.js";

const router = express.Router();

// Tüm kullanıcıları getir (sadece admin erişebilir)
router.get("/users", verifyToken, async (req, res) => {
  try {
    // Admin kontrolü
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkisiz erişim" });
    }

    const users = await User.find().select("-password"); // şifreyi dahil etme
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

router.post("/create-user", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkisiz erişim" });
    }

    const { name, email, password, departman, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı" });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      departman,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "Kullanıcı oluşturuldu", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

router.put("/users/:id/role", verifyToken, async (req, res) => {
  try {
    // sadece admin kullanıcılar erişebilir
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkisiz erişim" });
    }

    const { role } = req.body;
    const validRoles = ["admin", "personel"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Geçersiz rol" });
    }

    await User.findByIdAndUpdate(req.params.id, { role });

    res.status(200).json({ message: "Rol başarıyla güncellendi" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

router.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkisiz erişim" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Kullanıcı silindi" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

router.patch("/users/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkisiz erişim" });
    }

    const { departman, password } = req.body;
    const updateFields = {};

    if (departman) updateFields.departman = departman;
    if (password) updateFields.password = password;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({ message: "Kullanıcı güncellendi", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

router.get("/summary", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkisiz erişim" });
    }

    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalPersonel = await User.countDocuments({ role: "personel" });

    const users = await User.find();
    const departmanCounts = {};

    users.forEach((user) => {
      if (user.departman) {
        departmanCounts[user.departman] = (departmanCounts[user.departman] || 0) + 1;
      }
    });

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalPersonel,
      departmanCounts,
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

router.get("/recent-users", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkisiz erişim" });
    }

    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email departman createdAt");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

export default router;