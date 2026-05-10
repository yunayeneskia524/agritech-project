const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { createFarm, getFarms, updateFarm, deleteFarm } = require("../controllers/farmController");

router.post("/", auth, createFarm);
router.get("/", auth, getFarms);
router.put("/:id", auth, updateFarm);
router.delete("/:id", auth, deleteFarm);

module.exports = router;