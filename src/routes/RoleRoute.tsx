import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';
import { toast } from 'sonner';

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    toast.error('You do not have permission to access this page.');
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
