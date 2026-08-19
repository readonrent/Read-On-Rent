import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-navy dark:text-cream">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Frontend hiding is UX only — real enforcement is the backend's
  // authMiddleware + adminOnly middleware on /api/admin/* routes.
  if (!isAdmin) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center px-4">
        <p className="text-navy dark:text-cream font-medium">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return children;
}