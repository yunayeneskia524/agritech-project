const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stage: {
      type: String,
      enum: ["seedling", "growing", "harvest"],
      default: "seedling",
    },
    healthStatus: {
      type: String,
      enum: ["healthy", "sick"],
      default: "healthy",
    },
    plantingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);
