import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  changePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/change-password', authenticate, changePassword);

export default router;