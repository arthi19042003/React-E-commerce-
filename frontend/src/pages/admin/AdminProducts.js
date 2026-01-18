import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa'; 
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Popup State
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadProducts();
  }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: '' });
    }, 2000);
  };

  const loadProducts = async () => {
    try {
      const { data } = await getProducts();
      // Handle response structure differences
      const productList = data.products || data; 
      setProducts(productList);
    } catch (error) {
      console.error("Error loading products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        showPopup('Product deleted successfully');
        loadProducts(); // Refresh list
      } catch (error) {
        showPopup('Failed to delete product', 'error');
      }
    }
  };

  if (loading) return <div className="ad-loading">Loading Admin Panel...</div>;

  return (
    <div className="ad-wrapper">
      
      {/* Popup Notification */}
      {popup.show && (
        <div className="ad-popup-overlay">
          <div className="ad-popup-content" style={{ borderTop: `4px solid ${popup.type === 'success' ? '#2ecc71' : '#dc3545'}`}}>
            <div className={popup.type === 'success' ? 'ad-icon-success' : 'ad-icon-error'}>
              {popup.type === 'success' ? <FaCheck /> : <FaTimes />}
            </div>
            <p className="ad-popup-message">{popup.message}</p>
          </div>
        </div>
      )}

      <div className="ad-container">
        {/* Header Section */}
        <div className="ad-header">
          <h1 className="ad-title">Product Management</h1>
          {/* This Link matches the route in App.js */}
          <Link to="/admin/product/new" className="ad-btn-add">
            <FaPlus /> Add Product
          </Link>
        </div>

        {/* Table Section */}
        <div className="ad-table-container">
          <table className="ad-products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="ad-td-id">#{product._id.substring(0, 6)}</td>
                  <td className="ad-td-name">{product.name}</td>
                  <td className="ad-td-price">₹{product.price}</td>
                  
                  {/* FIXED: Changed from 'stock' to 'countInStock' */}
                  <td>{product.countInStock}</td>
                  
                  <td>
                    <span className="ad-badge">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td>
                    <div className="ad-actions">
                      <Link to={`/admin/product/${product._id}`} className="ad-btn-edit">
                        <FaEdit />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product._id)} 
                        className="ad-btn-delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <div className="ad-empty-state">No products found. Add one above!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;