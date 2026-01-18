import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProducts,
  deleteProduct
} from '../../services/api';
import './ManageProducts.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts({});
      setProducts(res.data.products);
    } catch (err) {
      console.error('LOAD PRODUCTS ERROR:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mp-wrapper">

      <div className="mp-header">
        <h1>Manage Products</h1>

        {/* 🔴 TEST BUTTON */}
        <button
          className="mp-btn"
          onClick={() => {
            console.log('ADD NEW PRODUCT BUTTON CLICKED');
            alert('BUTTON CLICKED');
            navigate('/admin/product/new');
          }}
        >
          ➕ Add New Product
        </button>
      </div>

      <table className="mp-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>
                <img
                  src={p.images?.[0]?.url || p.image || 'https://via.placeholder.com/60'}
                  alt={p.name}
                  className="mp-img-thumb"
                />
              </td>
              <td>{p.name}</td>
              <td>{p.category?.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button
                  onClick={() => {
                    console.log('EDIT CLICKED', p._id);
                    alert('EDIT CLICKED');
                    navigate(`/admin/product/${p._id}`);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    console.log('DELETE CLICKED', p._id);
                    handleDelete(p._id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default ManageProducts;
