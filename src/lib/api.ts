import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
    }
    return config;
});

export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export interface UrlResponse {
    id: string;
    originalUrl: string;
    slug: string;
    shortUrl: string;
    clicks: number;
    userId?: string;
    createdAt: string;
    updatedAt: string;
    qrCode?: boolean;
}

export interface CreateUrlRequest {
    originalUrl: string;
    qrCode?: boolean;
}

export interface UpdateUrlRequest {
    originalUrl: string;
    qrCode?: boolean;
}

export interface UrlListResponse {
    urls: UrlResponse[];
    total: number;
    page: number;
    limit: number;
}

export const authAPI = {
    register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', { email, password, name });
        return response.data;
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
};
const addOneWeek = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 7);
    return newDate;
  };
export const urlAPI = {
    createUrl: async (originalUrl: string, qrCode: boolean = true): Promise<UrlResponse> => {
        const response = await api.post('/urls', { originalUrl, qrCode, expiresAt: addOneWeek(new Date()).toISOString() });
        return response.data;
    },

    getUserUrls: async (page = 1, limit = 10): Promise<UrlListResponse> => {
        const response = await api.get(`/urls?page=${page}&limit=${limit}`);
        return response.data;
    },

    updateUrl: async (id: string, originalUrl: string, qrCode = false): Promise<UrlResponse> => {
        const response = await api.put(`/urls/${id}`, { originalUrl, qrCode });
        return response.data;
    },

    deleteUrl: async (id: string): Promise<void> => {
        await api.delete(`/urls/${id}`);
    },
};

export default api; 