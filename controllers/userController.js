import User from '../models/User.js';
import Task from '../models/Task.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, profilePicture } = req.body;
    
    // Find user
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (profilePicture) user.profilePicture = profilePicture;
    
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(req.params.id).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Get tasks assigned to user
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get tasks assigned to this user
    const tasks = await Task.find({ assignee: userId })
      .populate('sprint', 'name startDate endDate status')
      .populate('reporter', 'name username profilePicture')
      .sort({ updatedAt: -1 });
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user tasks', error: error.message });
  }
};

// Get tasks reported by user
export const getUserReportedTasks = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get tasks reported by this user
    const tasks = await Task.find({ reporter: userId })
      .populate('sprint', 'name startDate endDate status')
      .populate('assignee', 'name username profilePicture')
      .sort({ updatedAt: -1 });
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reported tasks', error: error.message });
  }
};

