import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["personel", "admin"],
      default: "personel",
    },
    departman: {
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
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);