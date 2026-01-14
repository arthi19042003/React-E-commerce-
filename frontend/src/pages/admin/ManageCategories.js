import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import { toast } from 'react-toastify';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.categories);
    } catch (error) {
      toast.error('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
        toast.success('Category updated successfully');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully');
      }
      resetForm();
      loadCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will affect all products in this category.')) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted successfully');
        loadCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manage-section">
      <div className="section-header">
        <h1>Manage Categories</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '➕ Add New Category'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Electronics, Clothing, Books"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this category"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingCategory ? '💾 Update Category' : '➕ Add Category'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="categories-grid-view">
        <h2>All Categories ({categories.length})</h2>
        {categories.length === 0 ? (
          <div className="empty-state">
            <p>No categories yet. Add your first category to organize products!</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map(category => (
              <div key={category._id} className="category-item">
                <div className="category-content">
                  <h3>{category.name}</h3>
                  <p>{category.description || 'No description'}</p>
                </div>
                <div className="category-actions">
                  <button 
                    className="btn btn-sm btn-info"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;