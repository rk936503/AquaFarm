import express from 'express';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import {
  addWaterUsage,
  getMyWaterUsage,
  getAnalytics,
  getAllWaterUsage,
  getSystemAnalytics,
} from '../controllers/waterUsageController.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Protected routes - Farmer
router.post('/', verifyToken, requireRole([ROLES.FARMER]), addWaterUsage);
router.get('/my', verifyToken, requireRole([ROLES.FARMER]), getMyWaterUsage);
router.get('/analytics/my', verifyToken, requireRole([ROLES.FARMER]), getAnalytics);

// Admin only
router.get('/', verifyToken, requireRole([ROLES.ADMIN]), getAllWaterUsage);
router.get('/analytics/system', verifyToken, requireRole([ROLES.ADMIN]), getSystemAnalytics);

export default router;
