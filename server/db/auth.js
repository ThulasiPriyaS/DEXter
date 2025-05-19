import { nanoid } from 'nanoid';
import Database from 'better-sqlite3';
import bcrypt from 'npm:bcryptjs@2.4.3';
import jwt from 'npm:jsonwebtoken@9.0.2';

const db = new Database('users.db');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function initializeAuth() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);
}

export async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, created_at)
      VALUES (?, ?, ?, ?)
    `);

    const userId = nanoid();
    stmt.run(userId, email, hashedPassword, Date.now());
    
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '24h' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export async function validateUser(email, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);
  
  if (!user) return null;
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  
  return jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '24h' });
}