import express from 'express';
import cors from 'cors';
import { router as workflowRoutes } from './routes/workflows.js';
import { initializeDatabase } from './db/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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