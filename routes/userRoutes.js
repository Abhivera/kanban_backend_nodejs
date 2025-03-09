import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  getUserTasks,
  getUserReportedTasks,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all users (Admin only)
router.get('/', authorize(['ADMIN', 'MANAGER']), getUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user (Admin or self only)
router.put('/:id', updateUser);

// Get tasks assigned to user
router.get('/:id/tasks', getUserTasks);

// Get tasks reported by user
router.get('/:id/reported-tasks', getUserReportedTasks);

export default router;