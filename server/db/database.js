import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';

const db = new Database('workflows.db');

// Initialize database
export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      wallet_address TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      wallet_address TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      modules TEXT NOT NULL,
      connections TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wallet_address) REFERENCES users(wallet_address)
    );
  `);
}

// User operations
export function createUser(walletAddress, passwordHash) {
  const stmt = db.prepare('INSERT INTO users (wallet_address, password_hash) VALUES (?, ?)');
  try {
    stmt.run(walletAddress, passwordHash);
    return true;
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return false; // User already exists
    }
    throw error;
  }
}

export function getUser(walletAddress) {
  const stmt = db.prepare('SELECT * FROM users WHERE wallet_address = ?');
  return stmt.get(walletAddress);
}

// Workflow operations
export function saveWorkflow(walletAddress, workflow) {
  const id = nanoid();
  const stmt = db.prepare(`
    INSERT INTO workflows (id, wallet_address, name, description, modules, connections)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    walletAddress,
    workflow.name,
    workflow.description || '',
    JSON.stringify(workflow.modules),
    JSON.stringify(workflow.connections)
  );
  
  return id;
}

export function getWorkflows(walletAddress) {
  const stmt = db.prepare('SELECT * FROM workflows WHERE wallet_address = ? ORDER BY created_at DESC');
  const workflows = stmt.all(walletAddress);
  
  return workflows.map(wf => ({
    ...wf,
    modules: JSON.parse(wf.modules),
    connections: JSON.parse(wf.connections)
  }));
}

export function getWorkflowById(id, walletAddress) {
  const stmt = db.prepare('SELECT * FROM workflows WHERE id = ? AND wallet_address = ?');
  const workflow = stmt.get(id, walletAddress);
  
  if (!workflow) return null;
  
  return {
    ...workflow,
    modules: JSON.parse(workflow.modules),
    connections: JSON.parse(workflow.connections)
  };
}

export function getWorkflowById(id, walletAddress) {
  const stmt = db.prepare('SELECT * FROM workflows WHERE id = ? AND wallet_address = ?');
  const workflow = stmt.get(id, walletAddress);

  if (!workflow) return null;

  return {
    ...workflow,
    modules: JSON.parse(workflow.modules),
    connections: JSON.parse(workflow.connections)
  };
}

export function deleteWorkflow(id, walletAddress) {
  const stmt = db.prepare('DELETE FROM workflows WHERE id = ? AND wallet_address = ?');
  const result = stmt.run(id, walletAddress);
  return result.changes > 0;
}

export function duplicateWorkflow(id, walletAddress) {
  const workflow = getWorkflowById(id, walletAddress);
<<<<<<< HEAD
  if (!workflow) return null;
  
  const newId = nanoid();
  const stmt = db.prepare(`
    INSERT INTO workflows (id, wallet_address, name, description, modules, connections)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
=======
  
  if (!workflow) return null;

  const newId = nanoid();
  const timestamp = Date.now();

  const stmt = db.prepare(`
    INSERT INTO workflows (
      id, wallet_address, name, description, 
      modules, connections, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
  stmt.run(
    newId,
    walletAddress,
    `${workflow.name} (Copy)`,
    workflow.description,
<<<<<<< HEAD
    workflow.modules,
    workflow.connections
  );
  
  return {
    ...workflow,
    id: newId,
    name: `${workflow.name} (Copy)`
  };
=======
    JSON.stringify(workflow.modules),
    JSON.stringify(workflow.connections),
    timestamp,
    timestamp
  );

  return getWorkflowById(newId, walletAddress);
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
}