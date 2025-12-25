import mongoose from 'mongoose';
import { WATER_SOURCES, CROP_TYPES } from '../config/constants.js';

const waterUsageSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer reference is required'],
    },
    source: {
      type: String,
      enum: Object.values(WATER_SOURCES),
      required: [true, 'Water source is required'],
    },
    usageAmount: {
      type: Number,
      required: [true, 'Usage amount is required'],
      min: [1, 'Usage amount must be at least 1 liter'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: new Date(),
    },
    cropType: {
      type: String,
      enum: CROP_TYPES,
      required: [true, 'Crop type is required'],
    },
    areaIrrigated: {
      type: Number, // in acres
      required: [true, 'Area irrigated is required'],
      min: [0.1, 'Area must be greater than 0'],
    },
    notes: {
      type: String,
      trim: true,
    },
    weatherCondition: {
      type: String,
      enum: ['sunny', 'cloudy', 'rainy', 'partly_cloudy'],
    },
    efficiency: {
      type: Number, // percentage
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
waterUsageSchema.index({ farmer: 1, date: -1 });
waterUsageSchema.index({ farmer: 1, createdAt: -1 });

const WaterUsage = mongoose.model('WaterUsage', waterUsageSchema);

export default WaterUsage;
