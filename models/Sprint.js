import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['PLANNING', 'ACTIVE', 'COMPLETED'],
    default: 'PLANNING',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
sprintSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Sprint = mongoose.model('Sprint', sprintSchema);

export default Sprint;
/**
 * @swagger
 * components:
 *   schemas:
 *     Sprint:
 *       type: object
 *       required:
 *         - name
 *         - startDate
 *         - endDate
 *         - createdBy
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the sprint
 *         description:
 *           type: string
 *           description: The description of the sprint
 *         startDate:
 *           type: string
 *           format: date
 *           description: The start date of the sprint
 *         endDate:
 *           type: string
 *           format: date
 *           description: The end date of the sprint
 *         status:
 *           type: string
 *           enum: [PLANNING, ACTIVE, COMPLETED]
 *           default: PLANNING
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the sprint
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
