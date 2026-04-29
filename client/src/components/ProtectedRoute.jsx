import React from 'react';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useApp();
  if (isLoading) return null; // or loading indicator
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
