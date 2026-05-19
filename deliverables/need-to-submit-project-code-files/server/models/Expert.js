const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema({
  question: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["tanaman", "tanah", "hama", "cuaca", "lainnya"],
    default: "lainnya",
  },
  answer: { type: String, default: "" },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, enum: ["pending", "answered"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Expert", expertSchema);
