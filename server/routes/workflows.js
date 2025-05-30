import express from 'express';
import { z } from 'zod';
<<<<<<< HEAD
import { 
  saveWorkflow, 
  getWorkflows, 
  getWorkflowById, 
  deleteWorkflow,
  duplicateWorkflow 
} from '../db/database.js';
=======
import { saveWorkflow, getWorkflows, deleteWorkflow, getWorkflowById, duplicateWorkflow } from '../db/database.js';
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
import { executeWorkflow } from '../services/simulateService.js';

const router = express.Router();

// Validation schemas
const ModuleSchema = z.object({
  id: z.string(),
  type: z.enum(['swap', 'stake', 'claim', 'bridge', 'lend']),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  label: z.string(),
  icon: z.string()
});

const ConnectionSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string()
});

const WorkflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  modules: z.array(ModuleSchema),
  connections: z.array(ConnectionSchema)
});

<<<<<<< HEAD
// Middleware to validate wallet address - temporarily disabled
// const validateWallet = (req, res, next) => {
//   const walletAddress = req.headers['x-wallet-address'];
//   if (!walletAddress) {
//     return res.status(401).json({ error: 'Wallet address required' });
//   }
//   req.walletAddress = walletAddress;
//   next();
// };

// Get all workflows
router.get('/', (req, res) => {
  try {
    // Using a default wallet address for now
    const defaultWallet = 'default-wallet';
    const workflows = getWorkflows(defaultWallet);
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific workflow
router.get('/:id', (req, res) => {
  try {
    const defaultWallet = 'default-wallet';
    const workflow = getWorkflowById(req.params.id, defaultWallet);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new workflow
router.post('/', (req, res) => {
  try {
    const validatedData = WorkflowSchema.parse(req.body);
    const defaultWallet = 'default-wallet';
    const id = saveWorkflow(defaultWallet, validatedData);
    res.status(201).json({ id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete a workflow
router.delete('/:id', (req, res) => {
  try {
    const defaultWallet = 'default-wallet';
    const success = deleteWorkflow(req.params.id, defaultWallet);
    if (!success) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Duplicate a workflow
router.post('/:id/duplicate', (req, res) => {
  try {
    const defaultWallet = 'default-wallet';
    const duplicatedWorkflow = duplicateWorkflow(req.params.id, defaultWallet);
    if (!duplicatedWorkflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.status(201).json(duplicatedWorkflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
=======
// Get all workflows
router.get('/workflows', (req, res) => {
  try {
    const { wallet } = req.query;
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const workflows = getWorkflows(wallet);
    res.json({ workflows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workflows', message: error.message });
  }
});

// Get single workflow
router.get('/workflows/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { wallet } = req.query;
    
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const workflow = getWorkflowById(id, wallet);
    
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    res.json({ workflow });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workflow', message: error.message });
  }
});

// Duplicate workflow
router.post('/workflows/:id/duplicate', (req, res) => {
  try {
    const { id } = req.params;
    const { wallet } = req.query;
    
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const newWorkflow = duplicateWorkflow(id, wallet);
    
    if (!newWorkflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    res.json(newWorkflow);
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate workflow', message: error.message });
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
  }
});

// Execute workflow
router.post('/:id/execute', async (req, res) => {
  try {
    const { modules, connections } = WorkflowSchema.parse(req.body);
    const results = await executeWorkflow(modules, connections);
    res.json({ results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid workflow data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Workflow execution failed', message: error.message });
    }
  }
});

<<<<<<< HEAD
export { router };
=======
// Save workflow
router.post('/save', async (req, res) => {
  try {
    const { wallet } = req.query;
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const workflow = WorkflowSchema.parse(req.body);
    const workflowId = saveWorkflow(wallet, workflow);
    
    res.json({ id: workflowId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid workflow data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to save workflow', message: error.message });
    }
  }
});

// Delete workflow
router.delete('/workflows/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { wallet } = req.query;
    
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const success = deleteWorkflow(id, wallet);
    
    if (success) {
      res.json({ message: 'Workflow deleted successfully' });
    } else {
      res.status(404).json({ error: 'Workflow not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workflow', message: error.message });
  }
});
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
