import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/api';
import { CartContext } from '../context/CartContext';
import { FaStar, FaBolt } from 'react-icons/fa'; 
import './ProductDetail.css'; // Import the unique CSS

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

  if (loading) return <div className="product-detail-page-loading">Loading...</div>;
  if (!product) return <div className="product-detail-page-error">Product not found</div>;

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="product-detail-page-wrapper">
      <div className="product-detail-page-container">
        
        {/* Main Grid: Images | Info | Buy Box */}
        <div className="product-detail-page-grid">
          
          {/* 1. Left Column: Images */}
          <div className="product-detail-page-left-col">
            <div className="product-detail-page-img-box">
              <img 
                src={product.images?.[0]?.url || '/placeholder.png'} 
                alt={product.name}
                className="product-detail-page-main-img"
              />
            </div>
          </div>

          {/* 2. Center Column: Product Info */}
          <div className="product-detail-page-center-col">
            <h1 className="product-detail-page-title">{product.name}</h1>
            
            <div className="product-detail-page-rating-row">
              <span className="product-detail-page-rating-val">{product.ratings?.average?.toFixed(1) || '0.0'}</span>
              <div className="product-detail-page-stars">
                 {[...Array(5)].map((_, i) => (
                   <FaStar 
                     key={i} 
                     className={i < Math.round(product.ratings?.average || 0) ? 'product-detail-page-star-filled' : 'product-detail-page-star-empty'} 
                   />
                 ))}
              </div>
              <span className="product-detail-page-rating-count">({product.ratings?.count || 0} ratings)</span>
            </div>

            <div className="product-detail-page-price-block">
              <div className="product-detail-page-price-row">
                <span className="product-detail-page-currency">₹</span>
                <span className="product-detail-page-price-text">{displayPrice}</span>
              </div>
              {hasDiscount && (
                <span className="product-detail-page-original-price">
                  M.R.P.: <strike>₹{product.price}</strike>
                </span>
              )}
              <span className="product-detail-page-tax-text">Inclusive of all taxes</span>
            </div>

            <div className="product-detail-page-meta">
              {product.category && (
                 <div className="product-detail-page-meta-row">
                   <span className="product-detail-page-label">Category:</span> 
                   <span className="product-detail-page-value">{product.category.name}</span>
                 </div>
              )}
              {product.brand && (
                 <div className="product-detail-page-meta-row">
                   <span className="product-detail-page-label">Brand:</span> 
                   <span className="product-detail-page-value">{product.brand}</span>
                 </div>
              )}
            </div>

            <div className="product-detail-page-description">
              <h3>About this item</h3>
              <p>{product.description}</p>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="product-detail-page-specs">
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
          <div className="product-detail-page-right-col">
            <div className="product-detail-page-price-row">
               <span className="product-detail-page-currency">₹</span>
               <span className="product-detail-page-price-text">{displayPrice}</span>
            </div>

            {product.stock > 0 ? (
              <>
                <span className="product-detail-page-status-in">In Stock</span>
                <div className="product-detail-page-qty-wrapper">
                  <label>Quantity:</label>
                  <select 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="product-detail-page-qty-select"
                  >
                    {[...Array(Math.min(product.stock, 10)).keys()].map(x => (
                      <option key={x+1} value={x+1}>{x+1}</option>
                    ))}
                  </select>
                </div>
                
                <button 
                  onClick={handleAddToCart} 
                  className="product-detail-page-btn product-detail-page-btn-primary"
                >
                  Add to Cart
                </button>
                <button className="product-detail-page-btn product-detail-page-btn-success">
                   <FaBolt style={{marginRight: '5px'}}/> Buy Now
                </button>
              </>
            ) : (
              <span className="product-detail-page-status-out">Currently Unavailable</span>
            )}
            
            <div className="product-detail-page-secure">
              <span className="icon">🔒</span> Secure transaction
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="product-detail-page-reviews-section">
            <h2>Customer Reviews</h2>
            {product.reviews.map((review, index) => (
              <div key={index} className="product-detail-page-review-card">
                <div className="product-detail-page-review-header">
                  <div className="product-detail-page-review-avatar">
                     {review.user?.name?.charAt(0) || 'U'}
                  </div>
                  <strong>{review.user?.name}</strong>
                </div>
                <div className="product-detail-page-review-stars">
                   {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < review.rating ? 'product-detail-page-star-filled' : 'product-detail-page-star-empty'} 
                      />
                   ))}
                   <span className="product-detail-page-review-title">
                     {review.rating >= 4 ? 'Great product!' : 'Verified Purchase'}
                   </span>
                </div>
                <p className="product-detail-page-review-text">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;