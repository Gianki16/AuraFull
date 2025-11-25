import apiClient, { setAuthToken } from '../client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role: 'USER' | 'TECHNICIAN' | 'ADMIN';
    description?: string;
    specialties?: string[];
}

export interface AuthResponse {
    token: string;
    type: string;
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'TECHNICIAN' | 'ADMIN' | 'SUPERADMIN';
}

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
        const { token } = response.data;
        setAuthToken(token);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
        const { token } = response.data;
        setAuthToken(token);
        return response.data;
    },

    logout: () => {
        setAuthToken(null);
    },

    getCurrentUser: async (): Promise<AuthResponse> => {
        const response = await apiClient.get<AuthResponse>('/api/auth/me');
        return response.data;
    }
};