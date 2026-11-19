import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardPath } from '../config/navigation';
import { LogoMark } from './ui/Logo';

/**
 * Guards portal routes. Visitors who are not logged in go to /login (and
 * come back afterwards); a logged-in user with another role is sent to
 * their own dashboard.
 */
const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand-50" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <LogoMark className="h-12 w-12 animate-pulse" />
          <p className="text-sm">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to={dashboardPath(user.role)} replace />;

  return children;
};

export default ProtectedRoute;
