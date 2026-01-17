import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { getOrderStats, getUserStats } from '../../services/api';
import ManageProducts from './ManageProducts';
import ManageCategories from './ManageCategories';
import ManageOrders from './ManageOrders';
import ManageUsers from './ManageUsers';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ orders: {}, users: {} });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="db-wrapper">
      {/* Sidebar */}
      <div className="db-sidebar">
        <div className="db-logo">
          <h2>Admin Panel</h2>
        </div>
        <nav className="db-nav">
          <Link to="/admin" className="db-nav-link">📊 Dashboard</Link>
          <Link to="/admin/products" className="db-nav-link">📦 Manage Products</Link>
          <Link to="/admin/categories" className="db-nav-link">🏷️ Manage Categories</Link>
          <Link to="/admin/orders" className="db-nav-link">🛒 Manage Orders</Link>
          <Link to="/admin/users" className="db-nav-link">👥 Manage Users</Link>
          <Link to="/" className="db-nav-link db-back">← Back to Site</Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="db-content">
        <Routes>
          {/* Dashboard Home (Stats) */}
          <Route path="/" element={
            <div className="db-home">
              <h1 className="db-title">Dashboard Overview</h1>
              
              {loading ? (
                <div className="db-loading">Loading statistics...</div>
              ) : (
                <div className="db-stats-grid">
                  <div className="db-stat-card">
                    <div className="db-stat-icon db-icon-orders">📦</div>
                    <div className="db-stat-details">
                      <h3>Total Orders</h3>
                      <p className="db-stat-value">{stats.orders.totalOrders || 0}</p>
                    </div>
                  </div>

                  <div className="db-stat-card">
                    <div className="db-stat-icon db-icon-pending">⏳</div>
                    <div className="db-stat-details">
                      <h3>Pending Orders</h3>
                      <p className="db-stat-value">{stats.orders.pendingOrders || 0}</p>
                    </div>
                  </div>

                  <div className="db-stat-card">
                    <div className="db-stat-icon db-icon-revenue">💰</div>
                    <div className="db-stat-details">
                      <h3>Total Revenue</h3>
                      <p className="db-stat-value">₹{stats.orders.totalRevenue || 0}</p>
                    </div>
                  </div>

                  <div className="db-stat-card">
                    <div className="db-stat-icon db-icon-users">👥</div>
                    <div className="db-stat-details">
                      <h3>Total Users</h3>
                      <p className="db-stat-value">{stats.users.totalUsers || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="db-quick-actions">
                <h2>Quick Actions</h2>
                <div className="db-action-buttons">
                  <button className="db-action-btn db-btn-primary" onClick={() => navigate('/admin/products')}>
                    ➕ Add Product
                  </button>
                  <button className="db-action-btn db-btn-secondary" onClick={() => navigate('/admin/categories')}>
                    ➕ Add Category
                  </button>
                  <button className="db-action-btn db-btn-info" onClick={() => navigate('/admin/orders')}>
                    📋 View Orders
                  </button>
                </div>
              </div>
            </div>
          } />

          {/* Sub Routes */}
          <Route path="/products" element={<ManageProducts />} />
          <Route path="/categories" element={<ManageCategories />} />
          <Route path="/orders" element={<ManageOrders />} />
          <Route path="/users" element={<ManageUsers />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;