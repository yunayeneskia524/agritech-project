const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  createCrop,
  getCrops,
  updateCrop,
  deleteCrop,
} = require("../controllers/cropController");

router.post("/", auth, createCrop);
router.get("/:farmId", auth, getCrops);
router.put("/:id", auth, updateCrop);
router.delete("/:id", auth, deleteCrop);

module.exports = router;
