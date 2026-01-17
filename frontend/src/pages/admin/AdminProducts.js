import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa'; // Added FaCheck, FaTimes
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Popup State
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadProducts();
  }, []);

  // 2. Helper to show popup with auto-hide
  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: '' });
    }, 2000);
  };

  const loadProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data.products);
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
        // 3. Use Custom Popup instead of alert
        showPopup('Product deleted successfully');
        loadProducts();
      } catch (error) {
        showPopup('Failed to delete product', 'error');
      }
    }
  };

  if (loading) return <div className="ad-loading">Loading Admin Panel...</div>;

  return (
    <div className="ad-wrapper">
      
      {/* 4. Render Popup if visible */}
      {popup.show && (
        <div className="ad-popup-overlay">
          <div className="ad-popup-content">
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
                  <td>{product.stock}</td>
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