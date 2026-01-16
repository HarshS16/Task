import { Router } from 'express';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { optionalAuthMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/deals - Get all deals
router.get('/', optionalAuthMiddleware, async (req: AuthRequest, res) => {
    try {
        const deals = await db
            .select()
            .from(schema.deals)
            .orderBy(schema.deals.createdAt);

        // Get user's wishlist if authenticated
        let wishlistDealIds: string[] = [];
        if (req.user) {
            const wishlistItems = await db
                .select({ dealId: schema.wishlist.dealId })
                .from(schema.wishlist)
                .where(eq(schema.wishlist.userId, req.user.id));
            wishlistDealIds = wishlistItems.map(item => item.dealId);
        }

        const formattedDeals = deals.map(deal => ({
            ...deal,
            bestAvailablePrice: deal.bestPrice ?? deal.currentPrice,
            isExpired: deal.status === 'expired',
            isDisabled: deal.status === 'disabled',
            inWishlist: wishlistDealIds.includes(deal.id)
        }));

        res.json({
            success: true,
            data: formattedDeals,
            count: formattedDeals.length
        });
    } catch (error) {
        console.error('Error fetching deals:', error);
        res.status(500).json({ error: 'Failed to fetch deals' });
    }
});

// GET /api/deals/:id - Get single deal
router.get('/:id', optionalAuthMiddleware, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;

        const deal = await db
            .select()
            .from(schema.deals)
            .where(eq(schema.deals.id, id))
            .limit(1);

        if (deal.length === 0) {
            return res.status(404).json({ error: 'Deal not found' });
        }

        // Check if in wishlist
        let inWishlist = false;
        let alertEnabled = false;
        if (req.user) {
            const wishlistItem = await db
                .select()
                .from(schema.wishlist)
                .where(eq(schema.wishlist.dealId, id))
                .limit(1);

            if (wishlistItem.length > 0) {
                inWishlist = true;
                alertEnabled = wishlistItem[0].alertEnabled;
            }
        }

        res.json({
            success: true,
            data: {
                ...deal[0],
                bestAvailablePrice: deal[0].bestPrice ?? deal[0].currentPrice,
                isExpired: deal[0].status === 'expired',
                isDisabled: deal[0].status === 'disabled',
                inWishlist,
                alertEnabled
            }
        });
    } catch (error) {
        console.error('Error fetching deal:', error);
        res.status(500).json({ error: 'Failed to fetch deal' });
    }
});

export default router;
