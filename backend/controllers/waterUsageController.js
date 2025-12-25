import WaterUsage from '../models/WaterUsage.js';
import { calculateAnalytics } from '../utils/analyticsUtils.js';
import { HTTP_STATUS } from '../config/constants.js';

export const addWaterUsage = async (req, res, next) => {
  try {
    const { source, usageAmount, date, cropType, areaIrrigated, notes, weatherCondition } =
      req.body;

    // Validation
    if (!source || !usageAmount || !date || !cropType || !areaIrrigated) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Calculate efficiency (liters per acre)
    const efficiency = Math.round((usageAmount / areaIrrigated) * 100) / 100;

    const waterUsage = await WaterUsage.create({
      farmer: req.user.id,
      source,
      usageAmount,
      date,
      cropType,
      areaIrrigated,
      notes,
      weatherCondition,
      efficiency,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Water usage logged successfully',
      data: waterUsage,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyWaterUsage = async (req, res, next) => {
  try {
    const { startDate, endDate, page = 1, limit = 20 } = req.query;

    let filter = { farmer: req.user.id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;
    const waterUsages = await WaterUsage.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-date')
      .lean();

    const total = await WaterUsage.countDocuments(filter);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: waterUsages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const { period = 'all' } = req.query;

    let filter = { farmer: req.user.id };
    const now = new Date();

    if (period === 'daily') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filter.date = { $gte: today };
    } else if (period === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filter.date = { $gte: weekAgo };
    } else if (period === 'monthly') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filter.date = { $gte: monthAgo };
    }

    const waterUsages = await WaterUsage.find(filter).lean();
    const analytics = calculateAnalytics(waterUsages);

    // Additional breakdown by source and crop
    const sourceBreakdown = {};
    const cropBreakdown = {};

    waterUsages.forEach((usage) => {
      sourceBreakdown[usage.source] = (sourceBreakdown[usage.source] || 0) + usage.usageAmount;
      cropBreakdown[usage.cropType] = (cropBreakdown[usage.cropType] || 0) + usage.usageAmount;
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        ...analytics,
        sourceBreakdown,
        cropBreakdown,
        period,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllWaterUsage = async (req, res, next) => {
  try {
    const { farmerId, startDate, endDate, page = 1, limit = 20 } = req.query;

    let filter = {};

    if (farmerId) {
      filter.farmer = farmerId;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;
    const waterUsages = await WaterUsage.find(filter)
      .populate('farmer', 'name email location')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-date')
      .lean();

    const total = await WaterUsage.countDocuments(filter);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: waterUsages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSystemAnalytics = async (req, res, next) => {
  try {
    // Total usage across all farmers
    const allWaterUsages = await WaterUsage.find().lean();
    const totalUsage = allWaterUsages.reduce((sum, u) => sum + u.usageAmount, 0);

    // Count active farmers
    const farmerCount = new Set(allWaterUsages.map((u) => u.farmer.toString())).size;

    // Average per farmer
    const avgPerFarmer = farmerCount > 0 ? Math.round(totalUsage / farmerCount) : 0;

    // Source distribution
    const sourceDistribution = {};
    allWaterUsages.forEach((usage) => {
      sourceDistribution[usage.source] = (sourceDistribution[usage.source] || 0) + usage.usageAmount;
    });

    // Inefficiency detection
    const inefficiencies = [];
    const sourceBreakdown = {};
    allWaterUsages.forEach((usage) => {
      if (!sourceBreakdown[usage.farmer]) {
        sourceBreakdown[usage.farmer] = {};
      }
      if (!sourceBreakdown[usage.farmer][usage.source]) {
        sourceBreakdown[usage.farmer][usage.source] = 0;
      }
      sourceBreakdown[usage.farmer][usage.source] += usage.usageAmount;
    });

    Object.entries(sourceBreakdown).forEach(([farmerId, sources]) => {
      const farmerTotal = Object.values(sources).reduce((a, b) => a + b, 0);
      if (sources.borewell && sources.borewell > farmerTotal * 0.7) {
        inefficiencies.push({
          farmerId,
          issue: 'Heavy borewell dependency',
          severity: 'high',
        });
      }
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        totalUsage: Math.round(totalUsage),
        farmerCount,
        avgPerFarmer,
        sourceDistribution,
        inefficiencies: inefficiencies.slice(0, 10),
      },
    });
  } catch (error) {
    next(error);
  }
};

export default { addWaterUsage, getMyWaterUsage, getAnalytics, getAllWaterUsage, getSystemAnalytics };
