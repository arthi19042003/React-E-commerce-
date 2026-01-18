import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Checking Admin Permissions...</div>;
  }

  // --- DEBUGGING LOGS (Check your browser console!) ---
  console.log("AdminRoute Check:");
  console.log("User:", user);
  console.log("Is Authenticated?", isAuthenticated);
  console.log("Is Admin?", isAdmin);
  // ----------------------------------------------------

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;