import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './contexts';

export const SecureRoute = ({ children }: { children: React.ReactNode }) => {
  const userContext = useContext(UserContext);

  if (!userContext.user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
