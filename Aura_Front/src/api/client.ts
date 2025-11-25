import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        sessionStorage.setItem('aura_token', token);
    } else {
        sessionStorage.removeItem('aura_token');
    }
};

export const getAuthToken = (): string | null => {
    return authToken || sessionStorage.getItem('aura_token');
};

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAuthToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const controller = new AbortController();
        config.signal = controller.signal;

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.code === 'ECONNABORTED') {
            toast.error('Request timeout. Please try again.');
        }

        if (!error.response) {
            toast.error('Network error. Please check your connection.');
            return Promise.reject(error);
        }

        const { status } = error.response;

        switch (status) {
            case 400:
                toast.error('Invalid request. Please check your input.');
                break;
            case 401:
                toast.error('Session expired. Please login again.');
                setAuthToken(null);
                window.location.href = '/login';
                break;
            case 403:
                toast.error('You do not have permission to perform this action.');
                break;
            case 404:
                toast.error('Resource not found.');
                break;
            case 409:
                toast.error('Conflict. This resource already exists.');
                break;
            case 500:
                toast.error('Server error. Please try again later.');
                break;
            default:
                toast.error('An unexpected error occurred.');
        }

        return Promise.reject(error);
    }
);

export default apiClient;