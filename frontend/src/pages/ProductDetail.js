import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/api';
import { CartContext } from '../context/CartContext';
import { FaStar, FaShoppingCart, FaBolt } from 'react-icons/fa'; // Added FaBolt for "Buy Now"
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

  if (loading) return <div className="ec-loading">Loading...</div>;
  if (!product) return <div className="ec-error">Product not found</div>;

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="ec-pd-page ec-container">
      <div className="ec-pd-grid">
        {/* 1. Left Column: Images */}
        <div className="ec-pd-images">
          <div className="ec-pd-img-container">
            <img 
              src={product.images?.[0]?.url || '/placeholder.png'} 
              alt={product.name}
              className="ec-pd-main-img"
            />
          </div>
        </div>

        {/* 2. Center Column: Product Info */}
        <div className="ec-pd-info">
          <h1 className="ec-pd-title">{product.name}</h1>
          
          <div className="ec-pd-rating">
            <span className="ec-pd-rating-val">{product.ratings?.average?.toFixed(1) || '0.0'}</span>
            <div className="ec-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(product.ratings?.average || 0) ? 'ec-star-filled' : 'ec-star-empty'} />
                ))}
            </div>
            <span className="ec-pd-rating-count">({product.ratings?.count || 0} ratings)</span>
          </div>

          <div className="ec-pd-price-block">
            <div className="ec-pd-price-row">
              <span className="ec-pd-symbol">₹</span>
              <span className="ec-pd-price">{displayPrice}</span>
            </div>
            {hasDiscount && (
              <span className="ec-pd-original-price">
                M.R.P.: <strike>₹{product.price}</strike>
              </span>
            )}
            <span className="ec-pd-tax-text">Inclusive of all taxes</span>
          </div>

          <div className="ec-pd-meta">
            {product.category && (
               <div className="ec-pd-meta-row">
                 <span className="label">Category:</span> 
                 <span className="value">{product.category.name}</span>
               </div>
            )}
            {product.brand && (
               <div className="ec-pd-meta-row">
                 <span className="label">Brand:</span> 
                 <span className="value">{product.brand}</span>
               </div>
            )}
          </div>

          <div className="ec-pd-desc">
            <h3>About this item</h3>
            <p>{product.description}</p>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="ec-pd-specs">
              <h3>Product Details</h3>
              <table>
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <th>{key}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 3. Right Column: Buy Box */}
        <div className="ec-pd-buy-box">
          <div className="ec-pd-price-row">
             <span className="ec-pd-symbol">₹</span>
             <span className="ec-pd-price">{displayPrice}</span>
          </div>

          {product.stock > 0 ? (
            <>
              <span className="ec-pd-status-in">In Stock</span>
              <div className="ec-pd-qty-wrapper">
                <label>Quantity:</label>
                <select 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="ec-pd-qty-select"
                >
                  {[...Array(Math.min(product.stock, 10)).keys()].map(x => (
                    <option key={x+1} value={x+1}>{x+1}</option>
                  ))}
                </select>
              </div>
              
              <button onClick={handleAddToCart} className="ec-btn ec-btn-primary ec-btn-block ec-btn-pill">
                Add to Cart
              </button>
              <button className="ec-btn ec-btn-success ec-btn-block ec-btn-pill">
                Buy Now
              </button>
            </>
          ) : (
            <span className="ec-pd-status-out">Currently Unavailable</span>
          )}
          
          <div className="ec-pd-secure">
            <span className="icon">🔒</span> Secure transaction
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="ec-pd-reviews">
          <h2>Customer Reviews</h2>
          {product.reviews.map((review, index) => (
            <div key={index} className="ec-review-card">
              <div className="ec-review-header">
                <div className="ec-review-user-icon">
                   {review.user?.name?.charAt(0) || 'U'}
                </div>
                <strong>{review.user?.name}</strong>
              </div>
              <div className="ec-review-stars">
                 {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? 'ec-star-filled' : 'ec-star-empty'} />
                 ))}
                 <span className="ec-review-title">{review.rating >= 4 ? 'Great product!' : 'Verified Purchase'}</span>
              </div>
              <p className="ec-review-text">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;