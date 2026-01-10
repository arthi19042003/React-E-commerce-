import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { getOrderStats, getUserStats } from '../../services/api';
import AdminProducts from './AdminProducts'; // <--- Import
import ProductForm from './ProductForm';     // <--- Import

const AdminDashboard = () => {
  const [stats, setStats] = useState({ orders: {}, users: {} });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        getOrderStats(),
        getUserStats()
      ]);
      setStats({
        orders: ordersRes.data.stats,
        users: usersRes.data.stats
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="admin-dashboard container">
      <h1 className="page-title">Admin Dashboard</h1>
      
      <div className="admin-nav" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <Link to="/admin" className="btn btn-secondary">Dashboard</Link>
        <Link to="/admin/products" className="btn btn-secondary">Products</Link>
        {/* You can add Categories/Orders links here later */}
      </div>

      <Routes>
        {/* Stats Page (Default) */}
        <Route path="/" element={
          <div className="stats-grid grid grid-4">
            <div className="stat-card card">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.orders.totalOrders || 0}</p>
            </div>
            <div className="stat-card card">
              <h3>Pending Orders</h3>
              <p className="stat-value">{stats.orders.pendingOrders || 0}</p>
            </div>
            <div className="stat-card card">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats.orders.totalRevenue || 0}</p>
            </div>
            <div className="stat-card card">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.users.totalUsers || 0}</p>
            </div>
          </div>
        } />

        {/* Product Routes */}
        <Route path="products" element={<AdminProducts />} />
        <Route path="product/new" element={<ProductForm />} />
        <Route path="product/:id" element={<ProductForm />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;