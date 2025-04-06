import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import adminRoutes from "./routes/admin.js";
import trainingRoutes from "./routes/training.js";

dotenv.config();

const connect = async () => {
    await mongoose.connect(process.env.MONGO);
};

connect()
    .then(() => console.log("Hoş Geldin Kaptan"))
    .catch((db_error) => console.log(db_error));

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/training", trainingRoutes);

app.get("/", (req, res) => {
    res.send("Hoş Geldin")
});

app.listen(5003, () => {
    console.log("Server 5003 portunda çalışıyor")
})