import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';

// Route Guards
import PrivateRoute from './components/PrivateRoute';
import UserRoute from './routes/UserRoute';
import AdminRoute from './routes/AdminRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="ec-app">
            <Navbar />

            <main className="ec-main-content">
              <Routes>
                {/* PUBLIC */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* USER ONLY */}
                <Route
                  path="/cart"
                  element={
                    <UserRoute>
                      <Cart />
                    </UserRoute>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <UserRoute>
                      <Checkout />
                    </UserRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <UserRoute>
                      <Orders />
                    </UserRoute>
                  }
                />

                <Route
                  path="/orders/:id"
                  element={
                    <UserRoute>
                      <OrderDetail />
                    </UserRoute>
                  }
                />

                {/* ANY LOGGED IN USER */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />

                {/* ADMIN ONLY */}
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>

            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
