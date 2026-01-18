import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Import your configured API instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Load user
  const loadUser = async () => {
    try {
      // Changed to match standard backend route: /api/users/profile
      const res = await api.get('/users/profile');
      // Adjust based on your backend response structure
      setUser(res.data.user || res.data);
    } catch (error) {
      console.error('Load user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      // Changed to match backend: /api/users/register
      const res = await api.post('/users/register', userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      // Changed to match backend: /api/users/login
      const res = await api.post('/users/login', credentials);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin === true || user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};