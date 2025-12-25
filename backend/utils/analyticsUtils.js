import { WATER_USAGE_THRESHOLDS } from '../config/constants.js';

export const calculateAnalytics = (waterUsages) => {
  if (!waterUsages || waterUsages.length === 0) {
    return {
      totalUsage: 0,
      averageDailyUsage: 0,
      weeklyUsage: 0,
      monthlyUsage: 0,
      alerts: [],
      suggestions: [],
    };
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const todayUsages = waterUsages.filter((u) => new Date(u.date) >= todayStart);
  const weekUsages = waterUsages.filter((u) => new Date(u.date) >= weekAgo);
  const monthUsages = waterUsages.filter((u) => new Date(u.date) >= monthAgo);

  const totalUsage = waterUsages.reduce((sum, u) => sum + u.usageAmount, 0);
  const dailyUsage = todayUsages.reduce((sum, u) => sum + u.usageAmount, 0);
  const weeklyUsage = weekUsages.reduce((sum, u) => sum + u.usageAmount, 0);
  const monthlyUsage = monthUsages.reduce((sum, u) => sum + u.usageAmount, 0);

  const averageDailyUsage = waterUsages.length > 0 ? totalUsage / waterUsages.length : 0;

  const alerts = [];
  if (dailyUsage > WATER_USAGE_THRESHOLDS.DAILY_CRITICAL) {
    alerts.push({
      level: 'critical',
      message: `Today's water usage (${dailyUsage}L) exceeds critical threshold!`,
    });
  } else if (dailyUsage > WATER_USAGE_THRESHOLDS.DAILY_WARNING) {
    alerts.push({
      level: 'warning',
      message: `Today's water usage (${dailyUsage}L) is high. Consider optimizing irrigation.`,
    });
  }

  if (weeklyUsage > WATER_USAGE_THRESHOLDS.WEEKLY_WARNING) {
    alerts.push({
      level: 'warning',
      message: `Weekly water usage (${weeklyUsage}L) is above average.`,
    });
  }

  const suggestions = generateSuggestions(waterUsages, weeklyUsage);

  return {
    totalUsage: Math.round(totalUsage),
    averageDailyUsage: Math.round(averageDailyUsage),
    dailyUsage: Math.round(dailyUsage),
    weeklyUsage: Math.round(weeklyUsage),
    monthlyUsage: Math.round(monthlyUsage),
    alerts,
    suggestions,
  };
};

export const generateSuggestions = (waterUsages, weeklyUsage) => {
  const suggestions = [];

  // Check for inefficient sources
  const sourceUsage = {};
  waterUsages.forEach((u) => {
    sourceUsage[u.source] = (sourceUsage[u.source] || 0) + u.usageAmount;
  });

  if (sourceUsage.borewell && sourceUsage.borewell > weeklyUsage * 0.6) {
    suggestions.push({
      type: 'source',
      message: 'Heavy reliance on borewell. Consider using canal or rainwater harvesting.',
      priority: 'high',
    });
  }

  // Check crop types and suggest water-efficient crops
  const cropUsage = {};
  waterUsages.forEach((u) => {
    cropUsage[u.cropType] = (cropUsage[u.cropType] || 0) + u.usageAmount;
  });

  const waterIntensiveCrops = ['sugarcane', 'rice'];
  Object.keys(cropUsage).forEach((crop) => {
    if (waterIntensiveCrops.includes(crop)) {
      suggestions.push({
        type: 'crop',
        message: `${crop.charAt(0).toUpperCase() + crop.slice(1)} is water-intensive. Diversify with water-efficient crops.`,
        priority: 'medium',
      });
    }
  });

  if (suggestions.length === 0) {
    suggestions.push({
      type: 'general',
      message: 'Your water usage is well-managed. Keep monitoring irrigation schedules.',
      priority: 'low',
    });
  }

  return suggestions;
};

export default calculateAnalytics;
