const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// hanya login user
router.get("/profile", auth, (req, res) => {
  res.json({
    message: "Profile accessed",
    user: req.user
  });
});

// hanya admin
router.get("/admin", auth, role("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin"
  });
});

module.exports = router;