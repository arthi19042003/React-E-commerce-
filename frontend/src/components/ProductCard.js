import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product._id, 1);
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0].url} alt={product.name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
        {product.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-category">{product.category?.name}</div>
        
        <div className="product-rating">
          <FaStar className="star-icon" />
          <span>{product.ratings?.average?.toFixed(1) || '0.0'}</span>
          <span className="rating-count">({product.ratings?.count || 0})</span>
        </div>
        
        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">₹{displayPrice}</span>
            {hasDiscount && (
              <span className="original-price">₹{product.price}</span>
            )}
          </div>
          
          {product.stock > 0 && (
            <button 
              onClick={handleAddToCart}
              className="add-to-cart-btn"
              title="Add to Cart"
            >
              <FaShoppingCart />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;