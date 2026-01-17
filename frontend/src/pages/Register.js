import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Importing the unique CSS

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }

    try {
      // Register without auto-login
      const res = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (res.data.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      alert(message);
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-page-container">
        <div className="register-page-card">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit} className="register-page-form">
            <div className="register-page-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="register-page-input" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Enter your full name"
                required 
              />
            </div>
            <div className="register-page-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="register-page-input" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                placeholder="Enter your email"
                required 
              />
            </div>
            <div className="register-page-group">
              <label>Password</label>
              <input 
                type="password" 
                className="register-page-input" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                placeholder="Create a password (min 6 characters)"
                required 
                minLength="6"
              />
              <p className="register-page-hint">Must be at least 6 characters</p>
            </div>
            <div className="register-page-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                className="register-page-input" 
                value={formData.confirmPassword} 
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                placeholder="Confirm your password"
                required 
              />
            </div>
            <button type="submit" className="register-page-btn">
              Create Account
            </button>
          </form>
          <p className="register-page-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;