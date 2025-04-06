import mongoose from "mongoose";

const TrainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    department: {
      type: String,
      enum: [
        "İnsan Kaynakları",
        "Satış & Pazarlama",
        "Bilgi Sistemleri",
        "Kat Hizmetleri",
        "Güvenlik",
        "Teknik Servis",
        "Satınalma",
        "Muhasebe",
        "Mutfak",
        "Yiyecek & İçecek",
        "Animasyon",
        "Kalite",
        "Ön Büro"
      ],
      required: true,
    },
    contentUrl: String, // PDF, video vs.
  },
  { timestamps: true }
);



export default mongoose.model("Training", TrainingSchema);