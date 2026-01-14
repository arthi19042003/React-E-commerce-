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
    <nav className="ec-navbar">
      <div className="ec-navbar__container">

        {/* ========= LOGO ========= */}
        <Link to="/" className="ec-navbar__brand">
          <h2>E-Store</h2>
        </Link>

        {/* ========= SEARCH ========= */}
        <div className="ec-navbar__search">
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

        {/* ========= MENU ========= */}
        <div className="ec-navbar__menu">
          <Link to="/" className="ec-navbar__link">Home</Link>
          <Link to="/products" className="ec-navbar__link">Products</Link>

          {/* ===== USER LINKS ===== */}
          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/cart" className="ec-navbar__cart">
                <FaShoppingCart />
                {cartItemsCount > 0 && (
                  <span className="ec-navbar__cart-badge">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              <Link to="/orders" className="ec-navbar__link">
                My Orders
              </Link>
            </>
          )}

          {/* ===== ADMIN ===== */}
          {isAuthenticated && isAdmin && (
            <Link to="/admin" className="ec-navbar__btn-admin">
              Admin Panel
            </Link>
          )}

          {/* ===== AUTH ===== */}
          {isAuthenticated ? (
            <div className="ec-navbar__user">
              <div className="ec-navbar__user-info">
                <FaUser />
                <span className="ec-navbar__user-name">
                  {user?.name}
                </span>
              </div>

              <div className="ec-navbar__dropdown">
                <Link
                  to="/profile"
                  className="ec-navbar__dropdown-item"
                >
                  👤 Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="ec-navbar__dropdown-item ec-navbar__logout"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="ec-navbar__btn-login">
                Login
              </Link>
              <Link to="/register" className="ec-navbar__btn-register">
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
