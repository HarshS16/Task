import { z } from 'zod';

export const addToWishlistSchema = z.object({
    dealId: z.string().min(1, 'Deal ID is required'),
    alertEnabled: z.boolean().optional().default(false)
});

export const updateWishlistSchema = z.object({
    alertEnabled: z.boolean()
});

export const wishlistParamsSchema = z.object({
    dealId: z.string().min(1, 'Deal ID is required')
});

export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;
export type UpdateWishlistInput = z.infer<typeof updateWishlistSchema>;
