const Farm = require("../models/Farm");
const Crop = require("../models/Crop");

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Ambil semua farm user
    const farms = await Farm.find({ userId });
    const farmIds = farms.map((f) => f._id);

    // Jika belum punya farm
    if (farmIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalFarms: 0,
          totalCrops: 0,
          healthyCrops: 0,
          sickCrops: 0,
        },
      });
    }

    const totalFarms = farms.length;

    const totalCrops = await Crop.countDocuments({
      farmId: { $in: farmIds },
    });

    const healthyCrops = await Crop.countDocuments({
      farmId: { $in: farmIds },
      healthStatus: "healthy",
    });

    const sickCrops = await Crop.countDocuments({
      farmId: { $in: farmIds },
      healthStatus: "sick",
    });

    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved",
      data: {
        totalFarms,
        totalCrops,
        healthyCrops,
        sickCrops,
      },
    });
  } catch (error) {
    next(error);
  }
};
