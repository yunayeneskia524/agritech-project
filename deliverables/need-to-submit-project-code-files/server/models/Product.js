const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ["pupuk", "pestisida", "benih", "alat"],
    required: true,
  },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  unit: { type: String, default: "kg" },
  stock: { type: Number, default: 0 },
  image: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
