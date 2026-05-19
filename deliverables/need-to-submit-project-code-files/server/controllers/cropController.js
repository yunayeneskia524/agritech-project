const Crop = require("../models/Crop");
const Farm = require("../models/Farm");

// CREATE CROP
exports.createCrop = async (req, res, next) => {
  try {
    const { farmId, name, stage, healthStatus, plantingDate } = req.body;

    // Validasi input
    if (!farmId || !name) {
      return res.status(400).json({
        success: false,
        message: "farmId and name are required",
      });
    }

    // Cek farm ada atau tidak
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    // Cek ownership
    if (farm.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const crop = await Crop.create({
      farmId,
      name,
      stage: stage || "seedling",
      healthStatus: healthStatus || "healthy",
      plantingDate: plantingDate || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: "Crop created successfully",
      data: crop,
    });
  } catch (error) {
    next(error);
  }
};

// GET CROPS BY FARM
exports.getCrops = async (req, res, next) => {
  try {
    const { farmId } = req.params;

    // Cek farm dulu
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    // Cek ownership
    if (farm.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const crops = await Crop.find({ farmId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: crops,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE CROP
exports.updateCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id).populate("farmId");

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    // Cek ownership lewat farm
    if (crop.farmId.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, stage, healthStatus } = req.body;

    crop.name = name || crop.name;
    crop.stage = stage || crop.stage;
    crop.healthStatus = healthStatus || crop.healthStatus;

    await crop.save();

    res.status(200).json({
      success: true,
      message: "Crop updated successfully",
      data: crop,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE CROP
exports.deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id).populate("farmId");

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    // Cek ownership lewat farm
    if (crop.farmId.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await crop.deleteOne();

    res.status(200).json({
      success: true,
      message: "Crop deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
