import axios from 'axios';

// 1. Create the Axios Instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add the Token Interceptor (The Fix for Login)
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 3. PRODUCT API CALLS ---
export const getProducts = (keyword = '') => api.get(`/products?keyword=${keyword}`);
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getFeaturedProducts = () => api.get('/products/top'); // Fetches top rated/featured

// --- 4. CATEGORY API CALLS ---
export const getCategories = () => api.get('/categories');
export const createCategory = (categoryData) => api.post('/categories', categoryData);
export const updateCategory = (id, categoryData) => api.put(`/categories/${id}`, categoryData);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// --- 5. ORDER API CALLS ---
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getMyOrders = () => api.get('/orders/myorders');
export const getAllOrders = () => api.get('/orders'); // Admin only
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/deliver`, { status });
export const cancelOrder = (id) => api.put(`/orders/${id}/cancel`); 

// --- 6. USER API CALLS ---
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (name, email, password) => api.post('/auth/register', { name, email, password });
export const getAllUsers = () => api.get('/users'); // Admin only
export const deleteUser = (id) => api.delete(`/users/${id}`); // Admin only

// --- 7. ADMIN DASHBOARD STATS ---
export const getOrderStats = () => api.get('/orders/stats'); // Total sales, etc.
export const getUserStats = () => api.get('/users/stats'); // New users, etc.

// Default export
export default api;