const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { getWeather } = require("../controllers/weatherController");

// protected route
router.get("/", auth, getWeather);

module.exports = router;