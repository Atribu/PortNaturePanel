import express from "express";
import Training from "../models/Training.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✔️ Eğitim oluştur
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, department, contentUrl } = req.body;
    const newTraining = new Training({ title, description, department, contentUrl });
    await newTraining.save();
    res.status(201).json({ message: "Eğitim oluşturuldu", training: newTraining });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

// ✔️ Tüm eğitimleri getir (isteğe göre filtrelenebilir)
router.get("/", verifyToken, async (req, res) => {
  try {
    const trainings = await Training.find().sort({ createdAt: -1 });
    res.status(200).json(trainings);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

// ✔️ Eğitimi sil
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Training.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Eğitim silindi" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

export default router;