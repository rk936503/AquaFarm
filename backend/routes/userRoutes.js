import express from 'express';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { getCurrentUser, updateProfile, getAllUsers } from '../controllers/userController.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Protected routes
router.get('/me', verifyToken, getCurrentUser);
router.put('/me', verifyToken, updateProfile);

// Admin only
router.get('/', verifyToken, requireRole([ROLES.ADMIN]), getAllUsers);

export default router;
