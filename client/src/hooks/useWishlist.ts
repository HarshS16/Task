import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { WishlistItem, Deal } from '../types';

export function useWishlist() {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const response = await api.getWishlist();
            return response.data as WishlistItem[];
        },
    });
}

export function useAddToWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ dealId, alertEnabled = false }: { dealId: string; alertEnabled?: boolean }) => {
            return api.addToWishlist(dealId, alertEnabled);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            queryClient.invalidateQueries({ queryKey: ['deal'] });
        },
    });
}

export function useRemoveFromWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dealId: string) => {
            return api.removeFromWishlist(dealId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            queryClient.invalidateQueries({ queryKey: ['deal'] });
        },
    });
}

export function useUpdateWishlistAlert() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ dealId, alertEnabled }: { dealId: string; alertEnabled: boolean }) => {
            return api.updateWishlistAlert(dealId, alertEnabled);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });
}

interface ToggleWishlistOptions {
    onAdd?: () => void;
    onRemove?: () => void;
    onError?: (error: Error) => void;
}

export function useToggleWishlist(options?: ToggleWishlistOptions) {
    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: async ({ dealId }: { dealId: string }) => {
            return api.addToWishlist(dealId, false);
        },
        onMutate: async ({ dealId }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['deal', dealId] });
            await queryClient.cancelQueries({ queryKey: ['deals'] });

            // Snapshot the previous value
            const previousDeal = queryClient.getQueryData(['deal', dealId]);
            const previousDeals = queryClient.getQueryData(['deals']);

            // Optimistically update the deal
            queryClient.setQueryData(['deal', dealId], (old: Deal | undefined) => {
                if (!old) return old;
                return { ...old, inWishlist: true };
            });

            // Optimistically update deals list (stored as Deal[] array)
            queryClient.setQueryData(['deals'], (old: Deal[] | undefined) => {
                if (!old) return old;
                return old.map((deal: Deal) =>
                    deal.id === dealId ? { ...deal, inWishlist: true } : deal
                );
            });

            return { previousDeal, previousDeals, dealId };
        },
        onSuccess: () => {
            options?.onAdd?.();
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
        onError: (error, _, context) => {
            // Rollback on error
            if (context?.dealId) {
                queryClient.setQueryData(['deal', context.dealId], context.previousDeal);
            }
            queryClient.setQueryData(['deals'], context?.previousDeals);
            options?.onError?.(error as Error);
        },
    });

    const removeMutation = useMutation({
        mutationFn: async (dealId: string) => {
            return api.removeFromWishlist(dealId);
        },
        onMutate: async (dealId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['deal', dealId] });
            await queryClient.cancelQueries({ queryKey: ['deals'] });

            // Snapshot the previous value
            const previousDeal = queryClient.getQueryData(['deal', dealId]);
            const previousDeals = queryClient.getQueryData(['deals']);

            // Optimistically update the deal
            queryClient.setQueryData(['deal', dealId], (old: Deal | undefined) => {
                if (!old) return old;
                return { ...old, inWishlist: false, alertEnabled: false };
            });

            // Optimistically update deals list (stored as Deal[] array)
            queryClient.setQueryData(['deals'], (old: Deal[] | undefined) => {
                if (!old) return old;
                return old.map((deal: Deal) =>
                    deal.id === dealId ? { ...deal, inWishlist: false, alertEnabled: false } : deal
                );
            });

            return { previousDeal, previousDeals, dealId };
        },
        onSuccess: () => {
            options?.onRemove?.();
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
        onError: (error, _, context) => {
            // Rollback on error
            if (context?.dealId) {
                queryClient.setQueryData(['deal', context.dealId], context.previousDeal);
            }
            queryClient.setQueryData(['deals'], context?.previousDeals);
            options?.onError?.(error as Error);
        },
    });

    return {
        toggle: (deal: Deal) => {
            if (deal.inWishlist) {
                removeMutation.mutate(deal.id);
            } else {
                addMutation.mutate({ dealId: deal.id });
            }
        },
        isLoading: addMutation.isPending || removeMutation.isPending,
    };
}
