import { Router } from 'express';
import { db, schema } from '../db/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { validateAlertPermission } from '../middleware/roles.js';
import { addToWishlistSchema, wishlistParamsSchema, updateWishlistSchema } from '../validators/wishlist.js';
import { trackEvent } from '../services/analytics.js';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/wishlist - Get user's wishlist with deal info
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.id;

        // Get wishlist items with deal information
        const wishlistItems = await db
            .select({
                id: schema.wishlist.id,
                dealId: schema.wishlist.dealId,
                alertEnabled: schema.wishlist.alertEnabled,
                createdAt: schema.wishlist.createdAt,
                deal: {
                    id: schema.deals.id,
                    title: schema.deals.title,
                    description: schema.deals.description,
                    imageUrl: schema.deals.imageUrl,
                    originalPrice: schema.deals.originalPrice,
                    currentPrice: schema.deals.currentPrice,
                    bestPrice: schema.deals.bestPrice,
                    retailer: schema.deals.retailer,
                    productUrl: schema.deals.productUrl,
                    status: schema.deals.status,
                    expiresAt: schema.deals.expiresAt
                }
            })
            .from(schema.wishlist)
            .innerJoin(schema.deals, eq(schema.wishlist.dealId, schema.deals.id))
            .where(eq(schema.wishlist.userId, userId))
            .orderBy(schema.wishlist.createdAt);

        // Format response with best available price
        const formattedItems = wishlistItems.map(item => ({
            id: item.id,
            dealId: item.dealId,
            alertEnabled: item.alertEnabled,
            createdAt: item.createdAt,
            deal: {
                ...item.deal,
                bestAvailablePrice: item.deal.bestPrice ?? item.deal.currentPrice,
                isExpired: item.deal.status === 'expired',
                isDisabled: item.deal.status === 'disabled'
            }
        }));

        res.json({
            success: true,
            data: formattedItems,
            count: formattedItems.length
        });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// POST /api/wishlist - Add deal to wishlist (idempotent)
router.post('/', authMiddleware, validateAlertPermission, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.id;
        const isSubscriber = req.user!.isSubscriber;

        // Validate request body
        const parseResult = addToWishlistSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: parseResult.error.flatten()
            });
        }

        const { dealId, alertEnabled } = parseResult.data;

        // Check if deal exists
        const deal = await db
            .select()
            .from(schema.deals)
            .where(eq(schema.deals.id, dealId))
            .limit(1);

        if (deal.length === 0) {
            return res.status(404).json({ error: 'Deal not found' });
        }

        // Check if already in wishlist (for idempotency)
        const existing = await db
            .select()
            .from(schema.wishlist)
            .where(and(
                eq(schema.wishlist.userId, userId),
                eq(schema.wishlist.dealId, dealId)
            ))
            .limit(1);

        if (existing.length > 0) {
            // Already exists - return success without creating duplicate (idempotent)
            return res.json({
                success: true,
                message: 'Deal already in wishlist',
                data: {
                    id: existing[0].id,
                    dealId: existing[0].dealId,
                    alertEnabled: existing[0].alertEnabled,
                    createdAt: existing[0].createdAt
                }
            });
        }

        // Non-subscribers can't enable alerts
        const finalAlertEnabled = isSubscriber ? alertEnabled : false;

        // Insert new wishlist entry
        const id = uuidv4();
        await db.insert(schema.wishlist).values({
            id,
            userId,
            dealId,
            alertEnabled: finalAlertEnabled
        });

        // Track analytics
        await trackEvent(userId, dealId, 'wishlist_add');

        res.status(201).json({
            success: true,
            message: 'Deal added to wishlist',
            data: {
                id,
                dealId,
                alertEnabled: finalAlertEnabled,
                createdAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

// PATCH /api/wishlist/:dealId - Update alert settings
router.patch('/:dealId', authMiddleware, validateAlertPermission, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.id;
        const isSubscriber = req.user!.isSubscriber;

        // Validate params
        const paramsResult = wishlistParamsSchema.safeParse(req.params);
        if (!paramsResult.success) {
            return res.status(400).json({
                error: 'Invalid deal ID',
                details: paramsResult.error.flatten()
            });
        }

        // Validate body
        const bodyResult = updateWishlistSchema.safeParse(req.body);
        if (!bodyResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: bodyResult.error.flatten()
            });
        }

        const { dealId } = paramsResult.data;
        const { alertEnabled } = bodyResult.data;

        // Non-subscribers can't enable alerts
        if (!isSubscriber && alertEnabled) {
            return res.status(403).json({
                error: 'Subscription required to enable alerts'
            });
        }

        // Find and update
        const existing = await db
            .select()
            .from(schema.wishlist)
            .where(and(
                eq(schema.wishlist.userId, userId),
                eq(schema.wishlist.dealId, dealId)
            ))
            .limit(1);

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Wishlist item not found' });
        }

        await db
            .update(schema.wishlist)
            .set({ alertEnabled })
            .where(and(
                eq(schema.wishlist.userId, userId),
                eq(schema.wishlist.dealId, dealId)
            ));

        res.json({
            success: true,
            message: 'Alert settings updated',
            data: {
                ...existing[0],
                alertEnabled
            }
        });
    } catch (error) {
        console.error('Error updating wishlist:', error);
        res.status(500).json({ error: 'Failed to update wishlist' });
    }
});

// DELETE /api/wishlist/:dealId - Remove deal from wishlist
router.delete('/:dealId', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.id;

        // Validate params
        const parseResult = wishlistParamsSchema.safeParse(req.params);
        if (!parseResult.success) {
            return res.status(400).json({
                error: 'Invalid deal ID',
                details: parseResult.error.flatten()
            });
        }

        const { dealId } = parseResult.data;

        // Check if exists
        const existing = await db
            .select()
            .from(schema.wishlist)
            .where(and(
                eq(schema.wishlist.userId, userId),
                eq(schema.wishlist.dealId, dealId)
            ))
            .limit(1);

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Wishlist item not found' });
        }

        // Delete
        await db
            .delete(schema.wishlist)
            .where(and(
                eq(schema.wishlist.userId, userId),
                eq(schema.wishlist.dealId, dealId)
            ));

        // Track analytics
        await trackEvent(userId, dealId, 'wishlist_remove');

        res.json({
            success: true,
            message: 'Deal removed from wishlist'
        });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

export default router;
