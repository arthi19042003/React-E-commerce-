import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();        // stop link navigation
    e.stopPropagation();       // stop bubbling
    addToCart(product._id, 1);
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  return (
    <Link
      to={`/products/${product._id}`}
      className="ec-product-card"
    >
      {/* IMAGE */}
      <div className="ec-pc-image-wrap">
        {product.images?.length > 0 ? (
          <img src={product.images[0].url} alt={product.name} />
        ) : (
          <div className="ec-pc-no-image">No Image</div>
        )}

        {product.stock === 0 && (
          <div className="ec-pc-out-stock">Out of Stock</div>
        )}
      </div>

      {/* INFO */}
      <div className="ec-pc-info">
        <h3 className="ec-pc-name">{product.name}</h3>

        <div className="ec-pc-category">
          {product.category?.name}
        </div>

        <div className="ec-pc-rating">
          <FaStar className="ec-star-icon" />
          <span>{product.ratings?.average?.toFixed(1) || '0.0'}</span>
          <span>({product.ratings?.count || 0})</span>
        </div>

        {/* FOOTER */}
        <div className="ec-pc-footer">
          <div className="ec-pc-price-row">
            <span className="ec-pc-current-price">
              {displayPrice}
            </span>

            {hasDiscount && (
              <span className="ec-pc-original-price">
                ₹{product.price}
              </span>
            )}
          </div>

          {product.stock > 0 && (
            <button
              className="ec-pc-add-btn"
              onClick={handleAddToCart}
              title="Add to cart"
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
