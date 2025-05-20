import express from 'express';
import cors from 'cors';
import { router as workflowRoutes } from './routes/workflows.js';
import { router as authRoutes } from './routes/auth.js';
import { initializeDatabase } from './db/database.js';
import { initializeAuth } from './db/auth.js';

const app = express();
const port = process.env.PORT || 3000;

<<<<<<< HEAD
// Initialize database
try {
  await initializeDatabase();
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}
=======
// Initialize databases
initializeDatabase();
initializeAuth();
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad

// Middleware
app.use(cors());
app.use(express.json());

// Routes
<<<<<<< HEAD
app.use('/api/workflows', workflowRoutes);
=======
app.use('/api/auth', authRoutes);
app.use('/api', workflowRoutes);
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});