import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate home page based on role
    const redirectPath =
      userRole === 'admin'    ? '/admin' :
      userRole === 'customer' ? '/menu'  :
      userRole === 'expo'     ? '/expo'  : '/staff';
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has the correct role
  return <Outlet />;
}
