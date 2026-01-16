import { db, schema } from './index.js';
import { sql } from 'drizzle-orm';

async function migrate() {
    console.log('Running migrations...');

    // Create tables using raw SQL
    const sqlite = (db as any).session.client;

    // Users table
    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      is_subscriber INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Deals table
    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      original_price REAL NOT NULL,
      current_price REAL NOT NULL,
      best_price REAL,
      retailer TEXT NOT NULL,
      product_url TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Wishlist table with unique constraint for idempotency
    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      deal_id TEXT NOT NULL,
      alert_enabled INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, deal_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
    )
  `);

    // Analytics events table
    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      deal_id TEXT NOT NULL,
      action TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Create indexes
    sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_wishlist_deal ON wishlist(deal_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id)`);

    console.log('Migrations completed!');
}

migrate().catch(console.error);
