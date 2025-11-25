import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Technician, Admin, Role } from '../types';
import { AuthService } from '../api';
import { setTokens, clearTokens } from '../api/axios.config';

type AuthUser = User | Technician | Admin;

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any, role: Role) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  clearError: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.login({ email, password });
          setTokens(response.token, response.refreshToken);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          await AuthService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          clearTokens();
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        }
      },
      
      register: async (data: any, role: Role) => {
        set({ isLoading: true, error: null });
        try {
          let response;
          if (role === Role.TECHNICIAN) {
            response = await AuthService.registerTechnician(data);
          } else {
            response = await AuthService.registerUser(data);
          }
          
          setTokens(response.token, response.refreshToken);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },
      
      setUser: (user: AuthUser | null) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        });
      },
      
      clearError: () => set({ error: null }),
      
      checkAuth: () => {
        const { user } = get();
        if (user) {
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
