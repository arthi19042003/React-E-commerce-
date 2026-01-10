import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/api';
import { CartContext } from '../context/CartContext';
import { FaStar } from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await getProduct(id);
      setProduct(res.data.product);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="product-detail container">
      <div className="product-detail-grid">
        <div className="product-images">
          <img 
            src={product.images?.[0]?.url || '/placeholder.png'} 
            alt={product.name}
            className="main-image"
          />
        </div>

        <div className="product-info-detail">
          <h1>{product.name}</h1>
          <div className="product-meta">
            <span className="category-badge">{product.category?.name}</span>
            {product.brand && <span className="brand">Brand: {product.brand}</span>}
          </div>

          <div className="rating-section">
            <FaStar className="star-icon" />
            <span>{product.ratings?.average?.toFixed(1) || '0.0'}</span>
            <span className="rating-count">({product.ratings?.count || 0} reviews)</span>
          </div>

          <div className="price-section">
            <span className="current-price">₹{displayPrice}</span>
            {hasDiscount && (
              <span className="original-price">₹{product.price}</span>
            )}
          </div>

          <div className="stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="purchase-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <button onClick={handleAddToCart} className="btn btn-primary btn-large">
                Add to Cart
              </button>
            </div>
          )}

          <div className="description-section">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="specifications">
              <h3>Specifications</h3>
              <table>
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {product.reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <strong>{review.user?.name}</strong>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? 'star-filled' : 'star-empty'} />
                  ))}
                </div>
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;