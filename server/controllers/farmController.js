const Farm = require("../models/Farm");

// CREATE FARM
exports.createFarm = async (req, res, next) => {
  try {
    const { name, location, size } = req.body;

    // Validasi
    if (!name || !location || !size) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, location, size)",
      });
    }

    const farm = await Farm.create({
      name,
      location,
      size,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Farm created successfully",
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

// GET FARMS (user sendiri)
exports.getFarms = async (req, res, next) => {
  try {
    const farms = await Farm.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: farms,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE FARM
exports.updateFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    if (farm.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, location, size } = req.body;

    farm.name = name || farm.name;
    farm.location = location || farm.location;
    farm.size = size || farm.size;

    await farm.save();

    res.status(200).json({
      success: true,
      message: "Farm updated",
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE FARM
exports.deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    if (farm.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await farm.deleteOne();

    res.status(200).json({
      success: true,
      message: "Farm deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
