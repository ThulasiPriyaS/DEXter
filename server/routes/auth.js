import express from 'express';
import { z } from 'zod';
import { createUser, validateUser } from '../db/auth.js';

export const router = express.Router();

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = AuthSchema.parse(req.body);
    const token = await createUser(email, password);
    res.json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create user', message: error.message });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = AuthSchema.parse(req.body);
    const token = await validateUser(email, password);
    
    if (!token) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      res.status(500).json({ error: 'Authentication failed', message: error.message });
    }
  }
});