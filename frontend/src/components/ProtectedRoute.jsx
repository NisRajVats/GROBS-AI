import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const auth = useAuth();

  if (!auth.isLoggedIn) {
    // If not logged in, redirect them to the login page
    // 'replace' stops them from using the "back" button to go to the protected page
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the page they were trying to access
  // <Outlet /> is a placeholder for the child route (e.g., <HomePage />)
  return <Outlet />;
}

export default ProtectedRoute;