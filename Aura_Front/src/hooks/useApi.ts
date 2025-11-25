import { useState, useEffect } from 'react';
import apiClient from '@/api/client';
import { AxiosError } from 'axios';

interface UseApiOptions {
    skip?: boolean;
}

export function useApi<T>(url: string, options?: UseApiOptions) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!options?.skip);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get<T>(url);
            setData(response.data);
        } catch (err) {
            const axiosError = err as AxiosError;
            setError(axiosError.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!options?.skip) {
            fetchData();
        }
    }, [url, options?.skip]);

    return { data, loading, error, refetch: fetchData };
}