import express from 'express';
import cors from 'cors';
import { router as workflowRoutes } from './routes/workflows.js';
import { router as authRoutes } from './routes/auth.js';
import { initializeDatabase } from './db/database.js';
import { initializeAuth } from './db/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize databases
initializeDatabase();
initializeAuth();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', workflowRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});