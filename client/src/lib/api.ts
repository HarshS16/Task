const API_BASE_URL = 'http://localhost:3001/api';

class ApiClient {
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getToken() {
        return this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'An error occurred');
        }

        return data;
    }

    // Auth
    async login(email: string, password: string) {
        const response = await this.request<{
            success: boolean;
            token: string;
            user: { id: string; email: string; name: string; isSubscriber: boolean };
        }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(response.token);
        return response;
    }

    async register(email: string, name: string, password: string) {
        const response = await this.request<{
            success: boolean;
            token: string;
            user: { id: string; email: string; name: string; isSubscriber: boolean };
        }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, name, password }),
        });
        this.setToken(response.token);
        return response;
    }

    logout() {
        this.setToken(null);
    }

    // Deals
    async getDeals() {
        return this.request<{ success: boolean; data: any[]; count: number }>('/deals');
    }

    async getDeal(id: string) {
        return this.request<{ success: boolean; data: any }>(`/deals/${id}`);
    }

    // Wishlist
    async getWishlist() {
        return this.request<{ success: boolean; data: any[]; count: number }>('/wishlist');
    }

    async addToWishlist(dealId: string, alertEnabled: boolean = false) {
        return this.request<{ success: boolean; data: any; message: string }>('/wishlist', {
            method: 'POST',
            body: JSON.stringify({ dealId, alertEnabled }),
        });
    }

    async updateWishlistAlert(dealId: string, alertEnabled: boolean) {
        return this.request<{ success: boolean; data: any; message: string }>(`/wishlist/${dealId}`, {
            method: 'PATCH',
            body: JSON.stringify({ alertEnabled }),
        });
    }

    async removeFromWishlist(dealId: string) {
        return this.request<{ success: boolean; message: string }>(`/wishlist/${dealId}`, {
            method: 'DELETE',
        });
    }
}

export const api = new ApiClient();
