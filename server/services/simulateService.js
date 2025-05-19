import { nanoid } from 'nanoid';

const OPERATION_DELAYS = {
  swap: 2000,
  stake: 3000,
  claim: 1500,
  bridge: 4000,
  lend: 2500
};

function simulateTransaction() {
  return {
    txHash: '0x' + nanoid(40),
    blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
    timestamp: Date.now()
  };
}

async function executeOperation(module, previousResults = []) {
  const delay = OPERATION_DELAYS[module.type] || 2000;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const transaction = simulateTransaction();
  
  return {
    moduleId: module.id,
    type: module.type,
    status: 'success',
    transaction,
    timestamp: Date.now()
  };
}

export async function executeWorkflow(modules, connections) {
  const results = [];
  const executionOrder = determineExecutionOrder(modules, connections);
  
  for (const module of executionOrder) {
    try {
      const result = await executeOperation(module, results);
      results.push(result);
    } catch (error) {
      results.push({
        moduleId: module.id,
        type: module.type,
        status: 'failed',
        error: error.message,
        timestamp: Date.now()
      });
      break;
    }
  }
  
  return results;
}

function determineExecutionOrder(modules, connections) {
  // Simple topological sort implementation
  const graph = new Map();
  const inDegree = new Map();
  
  // Initialize graphs
  modules.forEach(module => {
    graph.set(module.id, []);
    inDegree.set(module.id, 0);
  });
  
  // Build adjacency list and calculate in-degrees
  connections.forEach(conn => {
    graph.get(conn.sourceId).push(conn.targetId);
    inDegree.set(conn.targetId, (inDegree.get(conn.targetId) || 0) + 1);
  });
  
  // Find modules with no dependencies
  const queue = modules
    .filter(module => inDegree.get(module.id) === 0)
    .map(module => module.id);
  
  const order = [];
  
  while (queue.length > 0) {
    const currentId = queue.shift();
    const currentModule = modules.find(m => m.id === currentId);
    order.push(currentModule);
    
    for (const neighborId of graph.get(currentId)) {
      inDegree.set(neighborId, inDegree.get(neighborId) - 1);
      if (inDegree.get(neighborId) === 0) {
        queue.push(neighborId);
      }
    }
  }
  
  return order;
}