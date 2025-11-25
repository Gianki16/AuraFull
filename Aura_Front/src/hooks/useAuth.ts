import { useAuthStore } from '../stores/auth.store';
import { Role } from '../types';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, register, clearError } = useAuthStore();
  
  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };
  
  const hasAnyRole = (roles: Role[]): boolean => {
    return roles.some(role => user?.role === role);
  };
  
  const isUser = (): boolean => hasRole(Role.USER);
  const isTechnician = (): boolean => hasRole(Role.TECHNICIAN);
  const isAdmin = (): boolean => hasRole(Role.ADMIN);
  const isSuperAdmin = (): boolean => hasRole(Role.SUPERADMIN);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
    hasRole,
    hasAnyRole,
    isUser,
    isTechnician,
    isAdmin,
    isSuperAdmin,
  };
};
