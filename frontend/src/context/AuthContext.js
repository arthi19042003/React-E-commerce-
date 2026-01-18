import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; 
// We use 'useNavigate' to redirect the user after login/logout
import { useNavigate } from 'react-router-dom'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for redirection

  useEffect(() => {
    // 1. Check if user is already logged in when the app starts
    const userInfo = localStorage.getItem('userInfo');

    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser); // Set user from storage immediately
      
      // Optional: Verify token with backend to ensure it's still valid
      // fetchProfile(); 
    }
    setLoading(false);
  }, []);

  // --- ACTIONS ---

  // Register Function
  const register = async (userData) => {
    try {
      // 2. Updated Route: Matches 'authRoutes' typically used with 'authController'
      const { data } = await api.post('/auth/register', userData);
      
      // 3. Save as 'userInfo' to match your api.js interceptor
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      
      navigate('/'); // Redirect to home on success
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  // Login Function
  const login = async (email, password) => {
    try {
      // 2. Updated Route: Matches 'authController' loginUser function
      const { data } = await api.post('/auth/login', { email, password });
      
      // 3. Save as 'userInfo' (Critical for api.js to find the token)
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      
      navigate('/'); // Redirect to home on success
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('userInfo'); // Clear the storage
    setUser(null);
    navigate('/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        // Helper booleans for easy checking in components
        isAuthenticated: !!user,
        isAdmin: user?.user?.isAdmin === true || user?.isAdmin === true 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};