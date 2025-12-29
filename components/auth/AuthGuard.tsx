import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/auth" state={{ from: `${location.pathname}${location.search}` }} replace />;
  }

  if (!user.nickname) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
