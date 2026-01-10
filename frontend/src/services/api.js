import axios from 'axios';

// 1. Create a specific Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. Add Interceptor to automatically attach Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ===========================
   API CALLS
   =========================== */

// --- AUTH ---
export const login = (email, password) => 
  api.post('/auth/login', { email, password });

export const register = (name, email, password) => 
  api.post('/auth/register', { name, email, password });

export const getMe = () => 
  api.get('/auth/me');

// --- PRODUCTS ---
export const getProducts = (params) => 
  api.get('/products', { params }); // Handles ?search=iphone&category=123

export const getProduct = (id) => 
  api.get(`/products/${id}`);

export const getFeaturedProducts = () => 
  api.get('/products/featured');

export const createProduct = (data) => 
  api.post('/products', data); // Requires Admin Token

export const updateProduct = (id, data) => 
  api.put(`/products/${id}`, data); // Requires Admin Token

export const deleteProduct = (id) => 
  api.delete(`/products/${id}`); // Requires Admin Token

export const addReview = (id, data) => 
  api.post(`/products/${id}/reviews`, data);

// --- CATEGORIES ---
export const getCategories = () => 
  api.get('/categories');

export const createCategory = (data) => 
  api.post('/categories', data);

export const updateCategory = (id, data) => 
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id) => 
  api.delete(`/categories/${id}`);

// --- ORDERS ---
export const createOrder = (data) => 
  api.post('/orders', data);

export const getMyOrders = () => 
  api.get('/orders/my-orders');

export const getOrder = (id) => 
  api.get(`/orders/${id}`);

export const getAllOrders = (params) => 
  api.get('/orders', { params });

export const updateOrderStatus = (id, status) => 
  api.put(`/orders/${id}/status`, { status });

export const cancelOrder = (id) => 
  api.put(`/orders/${id}/cancel`);

export const getOrderStats = () => 
  api.get('/orders/stats');

// --- USERS ---
export const getAllUsers = () => 
  api.get('/users');

export const getUser = (id) => 
  api.get(`/users/${id}`);

export const updateUser = (id, data) => 
  api.put(`/users/${id}`, data);

export const deleteUser = (id) => 
  api.delete(`/users/${id}`);

export const getUserStats = () => 
  api.get('/users/stats');

export default api;