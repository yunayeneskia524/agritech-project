const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const API = "/api/v1";
app.use(`${API}/auth`, require("./routes/auth"));
app.use(`${API}/test`, require("./routes/test"));
app.use(`${API}/farms`, require("./routes/farm"));
app.use(`${API}/weather`, require("./routes/weather"));
app.use(`${API}/crops`, require("./routes/crop"));
app.use(`${API}/dashboard`, require("./routes/dashboard"));
app.use(`${API}/admin`, require("./routes/admin"));
app.use(`${API}/forum`, require("./routes/forum"));
app.use(`${API}/products`, require("./routes/product"));
app.use(`${API}/expert`, require("./routes/expert"));

app.get("/", (req, res) => res.json({ message: "Agri-Tech API v2 🚀" }));
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((e) => { console.error("❌ DB Error:", e.message); process.exit(1); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
