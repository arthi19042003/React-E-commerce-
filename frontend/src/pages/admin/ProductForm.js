import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProduct, updateProduct, getCategories } from '../../services/api';
import { toast } from 'react-toastify';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '' // Simple URL input for now
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data.categories);
      // Set default category if creating new
      if (!isEdit && data.categories.length > 0) {
        setFormData(prev => ({ ...prev, category: data.categories[0]._id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data } = await getProduct(id);
      const p = data.product;
      setFormData({
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        category: p.category?._id || p.category,
        image: p.images?.[0]?.url || ''
      });
    } catch (error) {
      toast.error('Error loading product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format data for backend
    const productData = {
      ...formData,
      images: [{ url: formData.image }] // Backend expects array of objects
    };

    try {
      if (isEdit) {
        await updateProduct(id, productData);
        toast.success('Product updated');
      } else {
        await createProduct(productData);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-control" required rows="3"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price</label>
            <input type="number" className="form-control" required min="0"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" className="form-control" required min="0"
              value={formData.stock}
              onChange={e => setFormData({...formData, stock: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select className="form-control" required
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input type="url" className="form-control" required placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={e => setFormData({...formData, image: e.target.value})}
          />
          <small>Use a public image URL (e.g., from Unsplash) for now.</small>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;