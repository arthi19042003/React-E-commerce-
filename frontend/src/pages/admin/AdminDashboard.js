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
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link">
            📊 Dashboard
          </Link>
          <Link to="/admin/products" className="admin-nav-link">
            📦 Manage Products
          </Link>
          <Link to="/admin/categories" className="admin-nav-link">
            🏷️ Manage Categories
          </Link>
          <Link to="/admin/orders" className="admin-nav-link">
            🛒 Manage Orders
          </Link>
          <Link to="/admin/users" className="admin-nav-link">
            👥 Manage Users
          </Link>
          <Link to="/" className="admin-nav-link back-to-site">
            ← Back to Site
          </Link>
        </nav>
      </div>

      <div className="admin-content">
        <Routes>
          <Route path="/" element={
            <div className="dashboard-home">
              <h1 className="admin-title">Dashboard Overview</h1>
              
              {loading ? (
                <div className="loading">Loading statistics...</div>
              ) : (
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon orders">📦</div>
                    <div className="stat-details">
                      <h3>Total Orders</h3>
                      <p className="stat-value">{stats.orders.totalOrders || 0}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon pending">⏳</div>
                    <div className="stat-details">
                      <h3>Pending Orders</h3>
                      <p className="stat-value">{stats.orders.pendingOrders || 0}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon revenue">💰</div>
                    <div className="stat-details">
                      <h3>Total Revenue</h3>
                      <p className="stat-value">₹{stats.orders.totalRevenue || 0}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon users">👥</div>
                    <div className="stat-details">
                      <h3>Total Users</h3>
                      <p className="stat-value">{stats.users.totalUsers || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button 
                    className="action-btn primary"
                    onClick={() => navigate('/admin/products')}
                  >
                    ➕ Add New Product
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => navigate('/admin/categories')}
                  >
                    ➕ Add New Category
                  </button>
                  <button 
                    className="action-btn info"
                    onClick={() => navigate('/admin/orders')}
                  >
                    📋 View All Orders
                  </button>
                </div>
              </div>
            </div>
          } />
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