import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProduct, updateProduct, getCategories } from '../../services/api';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './ProductForm.css';

const ProductForm = () => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '', image: '' });
  const [categories, setCategories] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    const fetchCats = async () => { const res = await getCategories(); setCategories(res.data.categories); };
    fetchCats();
    if (isEdit) {
       // logic to fetch product and fill form
    }
  }, [id]);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
        setPopup({ show: false, message: '', type: '' });
        navigate('/admin/products'); // Navigate AFTER popup shows
    }, 1500); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, images: [{ url: formData.image }] };
    try {
      if (isEdit) {
        await updateProduct(id, payload);
        showPopup('Product updated successfully!');
      } else {
        await createProduct(payload);
        showPopup('Product created successfully!');
      }
    } catch (error) {
      setPopup({ show: true, message: 'Error saving product', type: 'error' }); // Don't nav on error
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
    }
  };

  return (
    <div className="pf-container">
      {popup.show && (
        <div className="pf-overlay">
          <div className="pf-popup">
            <div className="pf-icon"><FaCheck /></div>
            <p style={{fontWeight: 'bold'}}>{popup.message}</p>
          </div>
        </div>
      )}
      <div className="pf-card">
        <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <input className="pf-input" placeholder="Name" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required />
          <textarea className="pf-input" placeholder="Desc" rows="3" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} required />
          <input className="pf-input" placeholder="Price" type="number" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} required />
          <input className="pf-input" placeholder="Stock" type="number" value={formData.stock} onChange={e=>setFormData({...formData, stock:e.target.value})} required />
          <input className="pf-input" placeholder="Image URL" value={formData.image} onChange={e=>setFormData({...formData, image:e.target.value})} required />
          <button className="pf-btn" type="submit">Save Product</button>
        </form>
      </div>
    </div>
  );
};
export default ProductForm;