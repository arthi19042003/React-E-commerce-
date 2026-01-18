import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Allow access if the user is logged in
  if (user) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default UserRoute;