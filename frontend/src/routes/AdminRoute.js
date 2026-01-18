import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  // 1. Get the actual values provided by your AuthContext
  const { user, loading } = useContext(AuthContext);

  // 2. Wait for user data to load before redirecting
  if (loading) {
    return <div>Loading...</div>;
  }

  // 3. Check if user exists AND is an admin
  // We check 'isAdmin' (boolean) OR 'role' (string) for safety
  if (user && (user.isAdmin || user.role === 'admin')) {
    return children;
  }

  // 4. If not authorized, kick them out
  return <Navigate to="/login" replace />;
};

export default AdminRoute;