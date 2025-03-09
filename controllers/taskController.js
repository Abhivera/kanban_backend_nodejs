import Task from '../models/Task.js';
import Sprint from '../models/Sprint.js';
import mongoose from 'mongoose';

// Get all tasks with filtering options
export const getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      assignee,
      reporter,
      sprint,
      search,
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (reporter) filter.reporter = reporter;
    if (sprint) filter.sprint = sprint;
    
    // Search in title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter)
      .populate('assignee', 'name username profilePicture')
      .populate('reporter', 'name username profilePicture')
      .populate('sprint', 'name startDate endDate status')
      .sort({ updatedAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name username profilePicture')
      .populate('reporter', 'name username profilePicture')
      .populate('sprint', 'name startDate endDate status')
      .populate('history.updatedBy', 'name username');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Create new task
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      assignee,
      reporter,
      sprint,
    } = req.body;

    // Validate that task has required fields
    if (!title || !assignee || !reporter) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if sprint exists if provided
    if (sprint) {
      const sprintExists = await Sprint.findById(sprint);
      if (!sprintExists) {
        return res.status(404).json({ message: 'Sprint not found' });
      }
    }

    const newTask = new Task({
      title,
      description,
      priority,
      status: status || 'TO_DO',
      assignee,
      reporter,
      sprint,
    });

    const savedTask = await newTask.save();

    // Populate references for response
    const populatedTask = await Task.findById(savedTask._id)
      .populate('assignee', 'name username profilePicture')
      .populate('reporter', 'name username profilePicture')
      .populate('sprint', 'name startDate endDate status');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      assignee,
      sprint,
      comment,
    } = req.body;

    const taskId = req.params.id;
    const updatedBy = req.user.id; // Assuming this comes from auth middleware

    // Find the task first
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if sprint exists if provided
    if (sprint) {
      const sprintExists = await Sprint.findById(sprint);
      if (!sprintExists) {
        return res.status(404).json({ message: 'Sprint not found' });
      }
    }

    // Set updatedBy for the history middleware
    task._updatedBy = updatedBy;
    task._statusComment = comment;

    // Update task fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (assignee) task.assignee = assignee;
    if (sprint !== undefined) task.sprint = sprint || null;

    await task.save();

    // Populate for response
    const updatedTask = await Task.findById(taskId)
      .populate('assignee', 'name username profilePicture')
      .populate('reporter', 'name username profilePicture')
      .populate('sprint', 'name startDate endDate status')
      .populate('history.updatedBy', 'name username');

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const deletedTask = await Task.findByIdAndDelete(taskId);
    
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({ message: 'Task deleted successfully', id: taskId });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

// Get tasks for Kanban board
export const getKanbanTasks = async (req, res) => {
  try {
    const { sprint, assignee } = req.query;
    
    const filter = {};
    if (sprint) filter.sprint = sprint;
    if (assignee) filter.assignee = assignee;
    
    const tasks = await Task.find(filter)
      .populate('assignee', 'name username profilePicture')
      .populate('reporter', 'name username profilePicture')
      .sort({ updatedAt: -1 });
    
    // Group by status
    const kanbanData = {
      TO_DO: [],
      IN_PROGRESS: [],
      REVIEW: [],
      DONE: [],
    };
    
    tasks.forEach(task => {
      kanbanData[task.status].push(task);
    });
    
    res.status(200).json(kanbanData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kanban tasks', error: error.message });
  }
};

// Move task (update status with drag and drop)
export const moveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const updatedBy = req.user.id; // From auth middleware
    
    if (!['TO_DO', 'IN_PROGRESS', 'REVIEW', 'DONE'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Set updatedBy for the history middleware
    task._updatedBy = updatedBy;
    task._statusComment = comment || `Status changed to ${status}`;
    
    // Update status
    task.status = status;
    
    await task.save();
    
    const updatedTask = await Task.findById(id)
      .populate('assignee', 'name username profilePicture')
      .populate('reporter', 'name username profilePicture');
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error moving task', error: error.message });
  }
};

// Add attachment to task
export const addAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const { filename, path } = req.body;
    const uploadedBy = req.user.id; // From auth middleware
    
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task.attachments.push({
      filename,
      path,
      uploadedBy,
    });
    
    await task.save();
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error adding attachment', error: error.message });
  }
};

// Remove attachment from task
export const removeAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;
    
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task.attachments = task.attachments.filter(
      attachment => attachment._id.toString() !== attachmentId
    );
    
    await task.save();
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error removing attachment', error: error.message });
  }
};
