import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Make sure you have react-icons installed
import './ManageCategories.css';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  
  // POPUP STATE
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadCategories();
  }, []);

  // Helper to show popup
  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000); // Auto hide after 2s
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.categories);
    } catch (error) {
      console.error('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
        showPopup('Category updated successfully!');
      } else {
        await createCategory(formData);
        showPopup('Category created successfully!');
      }
      resetForm();
      loadCategories();
    } catch (error) {
      showPopup(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will affect all products in this category.')) {
      try {
        await deleteCategory(id);
        showPopup('Category deleted successfully!');
        loadCategories();
      } catch (error) {
        showPopup('Failed to delete category', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setShowForm(true);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="mc-wrapper">
      {popup.show && (
        <div className="mc-popup-overlay">
          <div className="mc-popup-content">
            <div className={popup.type === 'success' ? 'mc-icon-success' : 'mc-icon-error'}>
              {popup.type === 'success' ? <FaCheck /> : <FaTimes />}
            </div>
            <p className="mc-msg">{popup.message}</p>
          </div>
        </div>
      )}

      <div className="mc-header">
        <h1>Manage Categories</h1>
        <button className="mc-btn mc-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Category'}
        </button>
      </div>

      {showForm && (
        <div className="mc-form-card">
          <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mc-form-group">
              <label className="mc-label">Name</label>
              <input className="mc-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="mc-form-group">
              <label className="mc-label">Description</label>
              <textarea className="mc-input" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <button type="submit" className="mc-btn mc-btn-success">{editingCategory ? 'Update' : 'Save'}</button>
            <button type="button" className="mc-btn mc-btn-secondary" onClick={resetForm}>Cancel</button>
          </form>
        </div>
      )}

      <div className="mc-grid">
        {categories.map(cat => (
          <div key={cat._id} className="mc-card">
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
            <div className="mc-actions">
              <button className="mc-btn mc-btn-sm mc-btn-info" onClick={() => handleEdit(cat)}>Edit</button>
              <button className="mc-btn mc-btn-sm mc-btn-danger" onClick={() => handleDelete(cat._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCategories;