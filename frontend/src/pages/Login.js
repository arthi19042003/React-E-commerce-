import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login({ email, password });
    if (result.success) {
      navigate('/');
    }
  };

  return (
    /* ✅ UNIQUE PAGE SCOPE */
    <div className="ec-login-page">
      <div className="ec-login-container">
        <div className="ec-login-card">
          <h2 className="ec-login-title">Welcome Back!</h2>

          <form onSubmit={handleSubmit} className="ec-login-form">
            <div className="ec-login-group">
              <label>Email Address</label>
              <input
                type="email"
                className="ec-login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="ec-login-group">
              <label>Password</label>
              <input
                type="password"
                className="ec-login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="ec-login-btn">
              Login
            </button>
          </form>

          <p className="ec-login-link">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
