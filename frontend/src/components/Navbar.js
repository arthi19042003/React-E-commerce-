import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaSearch
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate('/products', { state: { search } });
    setSearch('');
  };

  return (
    <nav className="navbar">
      <div className="container">

        {/* LOGO */}
        <Link to="/" className="navbar-brand">
          <h2>E-Store</h2>
        </Link>

        {/* 🔍 SEARCH BAR */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>

        {/* NAV LINKS */}
        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>

          {/* USER NAV */}
          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/cart" className="nav-link cart-link">
                <FaShoppingCart />
                {cartItemsCount > 0 && (
                  <span className="cart-badge">{cartItemsCount}</span>
                )}
              </Link>

              <Link to="/orders" className="nav-link">
                My Orders
              </Link>
            </>
          )}

          {/* ADMIN NAV */}
          {isAuthenticated && isAdmin && (
            <Link to="/admin" className="btn btn-admin">
              Admin Panel
            </Link>
          )}

          {/* AUTH */}
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <FaUser className="user-icon" />
                <span className="user-name">{user?.name}</span>
              </div>

              <div className="dropdown">
                <Link to="/profile" className="dropdown-item">
                  👤 Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="dropdown-item logout-btn"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-login">
                Login
              </Link>
              <Link to="/register" className="btn btn-register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
