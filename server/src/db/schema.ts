import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    password: text('password').notNull(),
    isSubscriber: integer('is_subscriber', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

// Deals table
export const deals = sqliteTable('deals', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
    originalPrice: real('original_price').notNull(),
    currentPrice: real('current_price').notNull(),
    bestPrice: real('best_price'), // Best available price if exists
    retailer: text('retailer').notNull(),
    productUrl: text('product_url'),
    status: text('status', { enum: ['active', 'expired', 'disabled'] }).notNull().default('active'),
    expiresAt: text('expires_at'),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

// Wishlist table
export const wishlist = sqliteTable('wishlist', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    dealId: text('deal_id').notNull().references(() => deals.id, { onDelete: 'cascade' }),
    alertEnabled: integer('alert_enabled', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

// Analytics events table
export const analyticsEvents = sqliteTable('analytics_events', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    dealId: text('deal_id').notNull(),
    action: text('action', { enum: ['wishlist_add', 'wishlist_remove'] }).notNull(),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;
export type Wishlist = typeof wishlist.$inferSelect;
export type NewWishlist = typeof wishlist.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
