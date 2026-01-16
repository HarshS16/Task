import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Deal } from '../types';

export function useDeals() {
    return useQuery({
        queryKey: ['deals'],
        queryFn: async () => {
            const response = await api.getDeals();
            return response.data as Deal[];
        },
    });
}

export function useDeal(id: string) {
    return useQuery({
        queryKey: ['deal', id],
        queryFn: async () => {
            const response = await api.getDeal(id);
            return response.data as Deal;
        },
        enabled: !!id,
    });
}
