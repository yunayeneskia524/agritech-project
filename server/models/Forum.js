const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const forumSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ["umum", "tanaman", "cuaca", "harga", "lainnya"],
    default: "umum",
  },
  replies: [replySchema],
}, { timestamps: true });

module.exports = mongoose.model("Forum", forumSchema);
