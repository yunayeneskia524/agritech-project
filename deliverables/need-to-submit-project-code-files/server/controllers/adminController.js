const User = require("../models/User");
const Farm = require("../models/Farm");
const Crop = require("../models/Crop");

// GET ALL USERS
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// DELETE USER
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Cannot delete admin" });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// CHANGE USER ROLE
exports.changeRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["farmer", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Role updated", data: user });
  } catch (error) {
    next(error);
  }
};

// ADMIN DASHBOARD STATS
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "farmer" });
    const totalFarms = await Farm.countDocuments();
    const totalCrops = await Crop.countDocuments();
    const sickCrops = await Crop.countDocuments({ healthStatus: "sick" });
    const recentUsers = await User.find({ role: "farmer" })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: { totalUsers, totalFarms, totalCrops, sickCrops, recentUsers },
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL ORDERS (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const Order = require("../models/Order");
    const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (e) { next(e); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const Order = require("../models/Order");
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order tidak ditemukan" });
    res.json({ success: true, data: order });
  } catch (e) { next(e); }
};
