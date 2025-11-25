import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import { ApiError } from '../types';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export const useApi = <T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
) => {
  const { immediate = false, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const apiError = axiosError.response?.data || {
        timestamp: new Date().toISOString(),
        status: axiosError.response?.status || 500,
        error: 'Error',
        message: axiosError.message || 'An error occurred',
        path: axiosError.config?.url || '',
      };
      setError(apiError);
      onError?.(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);
  
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);
  
  return { data, loading, error, execute, reset };
};
