import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { swaggerDocs } from './swagger.js';

// Routes
import taskRoutes from './routes/taskRoutes.js';
import sprintRoutes from './routes/sprintRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';



// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/tasks', taskRoutes);
app.use('/sprints', sprintRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// server is running or not  check route
app.get('/test_server', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error' 
  });
});

// Swagger documentation
swaggerDocs(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}/api-docs`);
});