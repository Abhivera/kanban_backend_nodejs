import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getKanbanTasks,
  moveTask,
  addAttachment,
  removeAttachment,
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

//authentication middleware 
router.use(authenticate);

// CRUD task
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Kanban and specialized endpoints
router.get('/kanban/board', getKanbanTasks);
router.patch('/:id/move', moveTask);
router.post('/:id/attachments', addAttachment);
router.delete('/:id/attachments/:attachmentId', removeAttachment);

export default router;