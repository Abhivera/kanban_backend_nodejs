import Sprint from '../models/Sprint.js';
import Task from '../models/Task.js';

// Get all sprints
export const getSprints = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    
    const sprints = await Sprint.find(filter)
      .populate('createdBy', 'name username')
      .sort({ startDate: -1 });
    
    res.status(200).json(sprints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sprints', error: error.message });
  }
};

// Get sprint by ID with tasks
export const getSprintById = async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id)
      .populate('createdBy', 'name username');
    
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    
    // Get tasks associated with this sprint
    const tasks = await Task.find({ sprint: req.params.id })
      .populate('assignee', 'name username profilePicture')
      .populate('reporter', 'name username profilePicture');
    
    res.status(200).json({ sprint, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sprint', error: error.message });
  }
};

// Create sprint
export const createSprint = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status } = req.body;
    const createdBy = req.user.id; // From auth middleware
    
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    const newSprint = new Sprint({
      name,
      description,
      startDate,
      endDate,
      status: status || 'PLANNING',
      createdBy,
    });
    
    const savedSprint = await newSprint.save();
    
    // Populate references
    const populatedSprint = await Sprint.findById(savedSprint._id)
      .populate('createdBy', 'name username');
    
    res.status(201).json(populatedSprint);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sprint', error: error.message });
  }
};

// Update sprint
export const updateSprint = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status } = req.body;
    
    const sprint = await Sprint.findById(req.params.id);
    
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    
    // Update fields
    if (name) sprint.name = name;
    if (description !== undefined) sprint.description = description;
    if (startDate) sprint.startDate = startDate;
    if (endDate) sprint.endDate = endDate;
    if (status) sprint.status = status;
    
    // Validate dates if both are provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    await sprint.save();
    
    const updatedSprint = await Sprint.findById(req.params.id)
      .populate('createdBy', 'name username');
    
    res.status(200).json(updatedSprint);
  } catch (error) {
    res.status(500).json({ message: 'Error updating sprint', error: error.message });
  }
};

// Delete sprint
export const deleteSprint = async (req, res) => {
  try {
    const sprintId = req.params.id;
    
    // Check if sprint exists
    const sprint = await Sprint.findById(sprintId);
    
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    
    // Remove sprint reference from all tasks
    await Task.updateMany(
      { sprint: sprintId },
      { $set: { sprint: null } }
    );
    
    // Delete sprint
    await Sprint.findByIdAndDelete(sprintId);
    
    res.status(200).json({ message: 'Sprint deleted successfully', id: sprintId });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sprint', error: error.message });
  }
};
