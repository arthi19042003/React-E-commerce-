import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css'; // Importing the unique CSS

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }
    });
  };

  return (
    <div className="profile-page-container">
      <h1 className="profile-page-title">My Profile</h1>
      
      <div className="profile-page-grid">
        
        {/* LEFT COLUMN: Info Card */}
        <div className="profile-page-info-card">
          <h3>Account Information</h3>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Member Since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
        
        {/* RIGHT COLUMN: Edit Form */}
        <form onSubmit={handleSubmit} className="profile-page-form-card">
          <h3>Update Profile</h3>
          
          <div className="profile-page-form-group">
            <label>Name</label>
            <input type="text" className="profile-page-input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="profile-page-form-group">
            <label>Phone</label>
            <input type="tel" className="profile-page-input"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <h4>Address</h4>
          
          <div className="profile-page-form-group">
            <label>Street</label>
            <input type="text" className="profile-page-input"
              value={formData.street}
              onChange={(e) => setFormData({...formData, street: e.target.value})}
            />
          </div>
          
          <div className="profile-page-form-row">
            <div className="profile-page-form-group">
              <label>City</label>
              <input type="text" className="profile-page-input"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div className="profile-page-form-group">
              <label>State</label>
              <input type="text" className="profile-page-input"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
              />
            </div>
          </div>
          
          <div className="profile-page-form-group">
            <label>ZIP Code</label>
            <input type="text" className="profile-page-input"
              value={formData.zipCode}
              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
            />
          </div>
          
          <button type="submit" className="profile-page-btn">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;