import express from 'express';
import cors from 'cors';
import { router as workflowRoutes } from './routes/workflows.js';
import { initializeDatabase } from './db/database.js';

const app = express();
const port = process.env.PORT || 3000;

// Initialize database
try {
  await initializeDatabase();
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workflows', workflowRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});