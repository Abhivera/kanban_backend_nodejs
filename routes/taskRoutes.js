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

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by task status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter by task priority
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: string
 *         description: Filter by task assignee
 *       - in: query
 *         name: reporter
 *         schema:
 *           type: string
 *         description: Filter by task reporter
 *       - in: query
 *         name: sprint
 *         schema:
 *           type: string
 *         description: Filter by sprint ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title or description
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     responses:
 *       200:
 *         description: A single task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get('/:id', getTaskById);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Missing required fields
 */
router.post('/', createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.put('/:id', updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
router.delete('/:id', deleteTask);

/**
 * @swagger
 * /tasks/kanban/board:
 *   get:
 *     summary: Get tasks for Kanban board
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sprint
 *         schema:
 *           type: string
 *         description: Filter by sprint ID
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: string
 *         description: Filter by task assignee
 *     responses:
 *       200:
 *         description: Kanban board data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 TO_DO:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 IN_PROGRESS:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 REVIEW:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 DONE:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get('/kanban/board', getKanbanTasks);

/**
 * @swagger
 * /tasks/{id}/move:
 *   patch:
 *     summary: Move task (update status with drag and drop)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [TO_DO, IN_PROGRESS, REVIEW, DONE]
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task moved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Task not found
 */
router.patch('/:id/move', moveTask);

/**
 * @swagger
 * /tasks/{id}/attachments:
 *   post:
 *     summary: Add attachment to task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               path:
 *                 type: string
 *     responses:
 *       200:
 *         description: Attachment added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.post('/:id/attachments', addAttachment);

/**
 * @swagger
 * /tasks/{id}/attachments/{attachmentId}:
 *   delete:
 *     summary: Remove attachment from task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *       - in: path
 *         name: attachmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Attachment ID
 *     responses:
 *       200:
 *         description: Attachment removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.delete('/:id/attachments/:attachmentId', removeAttachment);

export default router;
