import express from 'express';
import {
  getSprints,
  getSprintById,
  createSprint,
  updateSprint,
  deleteSprint,
} from '../controllers/sprintController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Sprint CRUD
router.get('/', getSprints);
router.get('/:id', getSprintById);
router.post('/', createSprint);
router.put('/:id', updateSprint);
router.delete('/:id', deleteSprint);

export default router;
