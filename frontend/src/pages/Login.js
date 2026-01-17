import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css'; // Importing the unique CSS

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
    <div className="login-page-wrapper">
      <div className="login-page-container">
        <div className="login-page-card">
          <h2>Welcome Back!</h2>

          <form onSubmit={handleSubmit} className="login-page-form">
            <div className="login-page-group">
              <label>Email Address</label>
              <input
                type="email"
                className="login-page-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="login-page-group">
              <label>Password</label>
              <input
                type="password"
                className="login-page-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-page-btn">
              Login
            </button>
          </form>

          <p className="login-page-link">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;