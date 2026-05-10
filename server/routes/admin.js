const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getAllUsers, deleteUser, changeRole, getAdminStats } = require("../controllers/adminController");

router.use(auth, role("admin"));
router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", changeRole);
module.exports = router;
