import axios from 'axios';

// 1. Create a specific Axios instance
// Note: We point to port 5000 because that's where your Backend lives
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. Add Interceptor to automatically attach Token to every request
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo'); // Check if you use 'userInfo' or 'token' key
    if (userInfo) {
       // If you stored the whole object:
       const { token } = JSON.parse(userInfo);
       if (token) config.headers.Authorization = `Bearer ${token}`;
       
       // OR if you just stored the token string (check your login page):
       // const token = localStorage.getItem('token');
       // if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===========================
   API CALLS
   =========================== */

// --- PRODUCTS ---
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// [FIX] This was missing and causing your crash
export const getFeaturedProducts = () => api.get('/products/featured'); 
export const addReview = (id, data) => api.post(`/products/${id}/reviews`, data);

// --- CATEGORIES ---
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// --- ORDERS ---
export const createOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/myorders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getAllOrders = (params) => api.get('/orders', { params });
export const updateOrderToDelivered = (id) => api.put(`/orders/${id}/deliver`);

// [FIX] These were missing
export const cancelOrder = (id) => api.put(`/orders/${id}/cancel`); 
export const getOrderStats = () => api.get('/orders/stats');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

// --- USERS / AUTH ---
// Ensure these match your Backend Routes exactly
export const login = (email, password) => api.post('/users/login', { email, password });
export const register = (name, email, password) => api.post('/users/register', { name, email, password });
export const getMe = () => api.get('/users/profile');
export const getAllUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getUserStats = () => api.get('/users/stats');

export default api;