import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const dbPath = './data/buzdealz.db';

// Ensure data directory exists
const dataDir = dirname(dbPath);
if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

export { schema };
