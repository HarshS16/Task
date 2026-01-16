import { db, schema } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export type AnalyticsAction = 'wishlist_add' | 'wishlist_remove';

export async function trackEvent(userId: string, dealId: string, action: AnalyticsAction): Promise<void> {
    try {
        await db.insert(schema.analyticsEvents).values({
            id: uuidv4(),
            userId,
            dealId,
            action
        });
        console.log(`Analytics: ${action} - User: ${userId}, Deal: ${dealId}`);
    } catch (error) {
        // Log error but don't fail the main operation
        console.error('Analytics tracking failed:', error);
    }
}
