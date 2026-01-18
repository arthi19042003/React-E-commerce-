import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProduct, updateProduct, getCategories } from '../../services/api';
import { FaCheck } from 'react-icons/fa';
import './ProductForm.css';

const ProductForm = () => {
  // 1. Changed 'stock' to 'countInStock' to match backend
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    countInStock: '', 
    category: '', 
    image: '' 
  });
  
  const [categories, setCategories] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const catRes = await getCategories();
        // Handle different response structures (catRes.data or catRes.data.categories)
        const cats = catRes.data.categories || catRes.data || [];
        setCategories(cats);

        // Fetch Product data if in Edit mode
        if (isEdit) {
            const prodRes = await getProduct(id);
            const product = prodRes.data.product || prodRes.data;
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                countInStock: product.countInStock || 0,
                category: product.category?._id || product.category, // Handle populated category object
                image: product.image
            });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
        setPopup({ show: false, message: '', type: '' });
        navigate('/admin/products'); 
    }, 1500); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Validate Category is selected
    if (!formData.category) {
        alert("Please select a category");
        return;
    }

    // 3. Construct Payload matching Backend Model
    const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
        category: formData.category,
        image: formData.image // Sending simple string as expected by standard controller
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
        showPopup('Product updated successfully!');
      } else {
        await createProduct(payload);
        showPopup('Product created successfully!');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Error saving product';
      setPopup({ show: true, message: errMsg, type: 'error' });
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
    }
  };

  return (
    <div className="pf-container">
      {popup.show && (
        <div className="pf-overlay">
          <div className="pf-popup" style={{ borderColor: popup.type === 'error' ? 'red' : 'green' }}>
            <div className="pf-icon" style={{ color: popup.type === 'error' ? 'red' : 'green' }}>
                <FaCheck />
            </div>
            <p style={{fontWeight: 'bold'}}>{popup.message}</p>
          </div>
        </div>
      )}
      <div className="pf-card">
        <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          
          <input 
            className="pf-input" 
            placeholder="Product Name" 
            value={formData.name} 
            onChange={e=>setFormData({...formData, name:e.target.value})} 
            required 
          />
          
          <textarea 
            className="pf-input" 
            placeholder="Description" 
            rows="3" 
            value={formData.description} 
            onChange={e=>setFormData({...formData, description:e.target.value})} 
            required 
          />

          {/* ADDED CATEGORY SELECTOR */}
          <select 
            className="pf-input" 
            value={formData.category} 
            onChange={e=>setFormData({...formData, category:e.target.value})}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <div style={{display:'flex', gap:'10px'}}>
            <input 
                className="pf-input" 
                placeholder="Price" 
                type="number" 
                value={formData.price} 
                onChange={e=>setFormData({...formData, price:e.target.value})} 
                required 
            />
            <input 
                className="pf-input" 
                placeholder="Count In Stock" 
                type="number" 
                value={formData.countInStock} 
                onChange={e=>setFormData({...formData, countInStock:e.target.value})} 
                required 
            />
          </div>

          <input 
            className="pf-input" 
            placeholder="Image URL" 
            value={formData.image} 
            onChange={e=>setFormData({...formData, image:e.target.value})} 
            required 
          />
          
          <button className="pf-btn" type="submit">
            {isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;