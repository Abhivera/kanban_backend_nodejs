import mongoose from 'mongoose';

const taskHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['TO_DO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM',
  },
  status: {
    type: String,
    enum: ['TO_DO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
    default: 'TO_DO',
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sprint',
  },
  attachments: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  history: [taskHistorySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add history entry pre-save middleware
taskSchema.pre('save', function(next) {
  // Skip for new documents
  if (this.isNew) {
    this.history.push({
      status: this.status,
      updatedBy: this.reporter,
      comment: 'Task created',
    });
    return next();
  }

  // Check if status has changed
  if (this.isModified('status')) {
    this.history.push({
      status: this.status,
      updatedBy: this._updatedBy || this.reporter, // _updatedBy is set in the controller
      comment: this._statusComment || `Status changed to ${this.status}`,
    });
  }
  
  this.updatedAt = Date.now();
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;