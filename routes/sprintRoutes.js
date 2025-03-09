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

/**
 * @swagger
 * /sprints:
 *   get:
 *     summary: Get all sprints
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by sprint status
 *     responses:
 *       200:
 *         description: A list of sprints
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sprint'
 */
router.get('/', getSprints);

/**
 * @swagger
 * /sprints/{id}:
 *   get:
 *     summary: Get a sprint by ID
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sprint ID
 *     responses:
 *       200:
 *         description: A single sprint with associated tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sprint:
 *                   $ref: '#/components/schemas/Sprint'
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       404:
 *         description: Sprint not found
 */
router.get('/:id', getSprintById);

/**
 * @swagger
 * /sprints:
 *   post:
 *     summary: Create a new sprint
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sprint'
 *     responses:
 *       201:
 *         description: Sprint created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sprint'
 *       400:
 *         description: Missing required fields or invalid date range
 */
router.post('/', createSprint);

/**
 * @swagger
 * /sprints/{id}:
 *   put:
 *     summary: Update a sprint
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sprint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sprint'
 *     responses:
 *       200:
 *         description: Sprint updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sprint'
 *       404:
 *         description: Sprint not found
 *       400:
 *         description: Invalid date range
 */
router.put('/:id', updateSprint);

/**
 * @swagger
 * /sprints/{id}:
 *   delete:
 *     summary: Delete a sprint
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sprint ID
 *     responses:
 *       200:
 *         description: Sprint deleted
 *       404:
 *         description: Sprint not found
 */
router.delete('/:id', deleteSprint);

export default router;
