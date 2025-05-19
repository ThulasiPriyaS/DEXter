import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';

const db = new Database('workflows.db');

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      wallet_address TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      modules JSON NOT NULL,
      connections JSON NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);
}

export function saveWorkflow(walletAddress, workflow) {
  const stmt = db.prepare(`
    INSERT INTO workflows (
      id, wallet_address, name, description, 
      modules, connections, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const id = nanoid();
  const timestamp = Date.now();

  stmt.run(
    id,
    walletAddress,
    workflow.name,
    workflow.description,
    JSON.stringify(workflow.modules),
    JSON.stringify(workflow.connections),
    timestamp,
    timestamp
  );

  return id;
}

export function getWorkflows(walletAddress) {
  const stmt = db.prepare('SELECT * FROM workflows WHERE wallet_address = ?');
  const workflows = stmt.all(walletAddress);

  return workflows.map(workflow => ({
    ...workflow,
    modules: JSON.parse(workflow.modules),
    connections: JSON.parse(workflow.connections)
  }));
}

export function deleteWorkflow(id, walletAddress) {
  const stmt = db.prepare('DELETE FROM workflows WHERE id = ? AND wallet_address = ?');
  const result = stmt.run(id, walletAddress);
  return result.changes > 0;
}