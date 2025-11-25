import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { Role } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user, hasAnyRole } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};
