import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../services/api';
import { FaCheck, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import './ManageProducts.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    brand: '',
    images: [{ url: '' }],
    isFeatured: false
  });

  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts({}),
        getCategories()
      ]);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Error loading data', error);
      // If 401 error, user might need to login
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
  };

  // --- SAFE HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Filter out empty images so Backend doesn't crash
    const validImages = formData.images.filter(img => img.url.trim() !== '');

    // 2. Prepare Data (Numbers & Valid Images)
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      discountPrice: Number(formData.discountPrice) || 0,
      images: validImages, 
      // Fallback for old backend compatibility
      image: validImages.length > 0 ? validImages[0].url : '', 
    };

    console.log("Submitting Payload:", payload);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
        showPopup('Product updated successfully!');
      } else {
        await createProduct(payload);
        showPopup('Product created successfully!');
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error("Submission Error:", error.response || error);
      
      // Handle Unauthorized specifically
      if (error.response && error.response.status === 401) {
        showPopup('Session Expired. Please Login.', 'error');
      } else {
        const errorMsg = error.response?.data?.message || 'Operation failed. Check Console.';
        showPopup(errorMsg, 'error');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || '',
      category: product.category._id || product.category,
      stock: product.stock,
      brand: product.brand || '',
      images: product.images && product.images.length > 0 ? product.images : [{ url: product.image || '' }],
      isFeatured: product.isFeatured || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        showPopup('Product deleted successfully');
        loadData();
      } catch (error) {
        showPopup('Failed to delete product', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: '', discountPrice: '', category: '',
      stock: '', brand: '', images: [{ url: '' }], isFeatured: false
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index].url = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, { url: '' }] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [{ url: '' }] });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mp-wrapper">
      {popup.show && (
        <div className="mp-overlay">
          <div className="mp-popup">
            <div className={`mp-icon ${popup.type === 'error' ? 'mp-icon-error' : ''}`}>
              {popup.type === 'success' ? <FaCheck /> : <FaTimes />}
            </div>
            <p style={{fontWeight: 'bold', fontSize: '1.2rem', color: '#333'}}>{popup.message}</p>
          </div>
        </div>
      )}

      <div className="mp-header">
        <h1>Manage Products</h1>
        <button className="mp-btn" onClick={() => { setShowForm(!showForm); resetForm(); }}>
          {showForm ? '✕ Cancel' : '➕ Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className="mp-form">
          <form onSubmit={handleSubmit}>
            <div className="mp-form-row">
              <div>
                <label className="mp-label">Product Name *</label>
                <input className="mp-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <label className="mp-label">Brand</label>
                <input className="mp-input" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
              </div>
            </div>

            <div className="mp-form-row">
              <div>
                <label className="mp-label">Price (₹) *</label>
                <input className="mp-input" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
              </div>
              <div>
                <label className="mp-label">Discount Price (₹)</label>
                <input className="mp-input" type="number" value={formData.discountPrice} onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} />
              </div>
            </div>

            <div className="mp-form-row">
              <div>
                <label className="mp-label">Stock Quantity *</label>
                <input className="mp-input" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
              </div>
              <div>
                <label className="mp-label">Category *</label>
                <select className="mp-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{marginBottom: '20px'}}>
              <label className="mp-label">Description *</label>
              <textarea className="mp-textarea" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
            </div>

            <div style={{marginBottom: '20px'}}>
              <label className="mp-label">Product Images (URLs)</label>
              {formData.images.map((img, index) => (
                <div key={index} className="mp-image-group">
                  <input 
                    className="mp-input" 
                    placeholder="https://example.com/image.jpg" 
                    value={img.url} 
                    onChange={(e) => handleImageChange(index, e.target.value)} 
                    required={index === 0} 
                  />
                  {formData.images.length > 1 && (
                    <button type="button" className="mp-del" style={{borderRadius: '6px', padding: '0 15px'}} onClick={() => removeImageField(index)}>
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="mp-btn-add-img" onClick={addImageField}>+ Add Another Image</button>
            </div>

            <div className="mp-checkbox-group">
              <input 
                type="checkbox" 
                id="featured"
                className="mp-checkbox"
                checked={formData.isFeatured} 
                onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} 
              />
              <label htmlFor="featured" className="mp-checkbox-label">Mark as Featured Product</label>
            </div>

            <button className="mp-btn-save" type="submit">
              {editingProduct ? '💾 Update Product' : '➕ Save Product'}
            </button>
          </form>
        </div>
      )}

      <div className="mp-table-box">
        <table className="mp-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>
                  <img src={p.images?.[0]?.url || p.image || 'https://via.placeholder.com/60'} className="mp-img-thumb" alt={p.name} />
                </td>
                <td>
                  <div style={{fontWeight: 'bold', fontSize: '1rem'}}>{p.name}</div>
                  <div style={{fontSize: '0.85rem', color: '#777'}}>{p.brand}</div>
                </td>
                <td>{p.category?.name}</td>
                <td>
                  {p.discountPrice ? (
                    <div>
                      <span style={{color: '#e74c3c', fontWeight: 'bold'}}>₹{p.discountPrice}</span>
                      <br/>
                      <span style={{textDecoration: 'line-through', fontSize: '0.85rem', color: '#999'}}>₹{p.price}</span>
                    </div>
                  ) : (
                    <span>₹{p.price}</span>
                  )}
                </td>
                <td>{p.stock}</td>
                <td>{p.isFeatured ? '⭐ Yes' : 'No'}</td>
                <td>
                  <button className="mp-btn-sm mp-edit" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="mp-btn-sm mp-del" onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;