import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import UserTrainingStatus from "../models/UserTrainingStatus.js";
import Training from "../models/Training.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// multer ayarları (üstte tanımlanmalı!)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Yeni eğitim oluştur (Dosya yükleme)
router.post("/", verifyToken, upload.single("contentFile"), async (req, res) => {
  try {
    const { title, description, department } = req.body;
    const contentUrl = req.file ? `uploads/${req.file.filename}` : null;

    const newTraining = new Training({
      title,
      description,
      department,
      contentUrl,
    });

    await newTraining.save();
    res.status(201).json(newTraining);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
});

// ✅ Tüm eğitimleri getir (Admin için)
router.get("/", verifyToken, async (req, res) => {
  try {
    const trainings = await Training.find();
    res.status(200).json(trainings);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

// ✅ Eğitimi güncelle (Admin için, dosya opsiyonel)
router.put("/:id", verifyToken, upload.single("contentFile"), async (req, res) => {
  try {
    const { title, description, department } = req.body;

    const updateFields = { title, description, department };
    if (req.file) {
      updateFields.contentUrl = `uploads/${req.file.filename}`;
    }

    const updatedTraining = await Training.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.status(200).json(updatedTraining);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

// ✅ Eğitimi sil (Admin için)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Training.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Eğitim silindi" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

// ✅ Departmana göre eğitim getir (Personel için)
router.get("/department/:department", verifyToken, async (req, res) => {
  try {
    const trainings = await Training.find({ department: req.params.department });
    res.status(200).json(trainings);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

// Eğitimi tamamlandı olarak işaretle
router.post("/:id/complete", verifyToken, async (req, res) => {
  const { id: trainingId } = req.params;
  const userId = req.user.id;

  try {
    const existingStatus = await UserTrainingStatus.findOne({ user: userId, training: trainingId });

    if (existingStatus && existingStatus.completed) {
      return res.status(400).json({ message: "Bu eğitim zaten tamamlanmış." });
    }

    const status = existingStatus || new UserTrainingStatus({ user: userId, training: trainingId });
    status.completed = true;
    status.completedAt = new Date();

    await status.save();

    res.status(200).json({ message: "Eğitim tamamlandı olarak işaretlendi.", status });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

// Kullanıcının tamamladığı eğitimleri getir
router.get("/completed", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const completedTrainings = await UserTrainingStatus.find({
      user: userId,
      completed: true,
    }).populate("training");

    const completed = completedTrainings
      .filter((item) => item.training)
      .map((item) => ({
        trainingId: item.training._id.toString(),
        completedAt: item.completedAt, // 👈 TAMAMLANMA TARİHİ BURADA
      }));

    res.status(200).json({ completed });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

export default router;