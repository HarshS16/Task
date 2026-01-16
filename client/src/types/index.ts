export interface User {
    id: string;
    email: string;
    name: string;
    isSubscriber: boolean;
}

export interface Deal {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    originalPrice: number;
    currentPrice: number;
    bestPrice: number | null;
    bestAvailablePrice: number;
    retailer: string;
    productUrl: string | null;
    status: 'active' | 'expired' | 'disabled';
    expiresAt: string | null;
    createdAt: string;
    isExpired: boolean;
    isDisabled: boolean;
    inWishlist?: boolean;
    alertEnabled?: boolean;
}

export interface WishlistItem {
    id: string;
    dealId: string;
    alertEnabled: boolean;
    createdAt: string;
    deal: Deal;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    message?: string;
}
