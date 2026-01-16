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

export function useToggleWishlist() {
    const addMutation = useAddToWishlist();
    const removeMutation = useRemoveFromWishlist();

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
