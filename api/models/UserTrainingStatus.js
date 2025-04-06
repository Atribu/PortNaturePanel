import mongoose from "mongoose";

const UserTrainingStatusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  training: { type: mongoose.Schema.Types.ObjectId, ref: "Training", required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("UserTrainingStatus", UserTrainingStatusSchema);