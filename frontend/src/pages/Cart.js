import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import './Cart.css'; // Importing the unique CSS file

const Cart = () => {
  // Access global cart state and functions from Context
  const { cart, updateCartItem, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // ----------------------------------------------------------------------
  // HELPER: Handles various image URL formats (API uploads vs External links)
  // ----------------------------------------------------------------------
  const getImageUrl = (url) => {
    // 1. Fallback if no URL is provided
    if (!url) return 'https://via.placeholder.com/150';
    
    // 2. If it's a full web link (e.g., Cloudinary, S3), use as is
    if (url.startsWith('http')) return url;
    
    // 3. Fix Windows path separators (\) to Web separators (/)
    let cleanPath = url.replace(/\\/g, '/');
    
    // 4. Ensure path starts with '/' for local server assets
    if (!cleanPath.startsWith('/')) {
        cleanPath = `/${cleanPath}`;
    }

    return cleanPath;
  };

  // ----------------------------------------------------------------------
  // VIEW: Empty Cart State
  // ----------------------------------------------------------------------
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page-container">
        <div className="cart-page-empty-state">
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Your cart is empty</h2>
          <p className="cart-page-empty-text">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/products" className="cart-page-btn cart-page-btn-primary" style={{ maxWidth: '200px', margin: '0 auto' }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // LOGIC: Quantity Handler
  // ----------------------------------------------------------------------
  const handleQuantityChange = (itemId, newQuantity) => {
    // Prevent quantity from dropping below 1
    if (newQuantity > 0) {
      updateCartItem(itemId, newQuantity);
    }
  };

  // ----------------------------------------------------------------------
  // VIEW: Main Cart Layout
  // ----------------------------------------------------------------------
  return (
    <div className="cart-page-container">
      <h1 className="cart-page-title">Shopping Cart</h1>
      
      <div className="cart-page-content">
        
        {/* === LEFT COLUMN: Cart Items List === */}
        <div className="cart-page-items-section">
          {cart.items.map(item => (
            <div key={item._id} className="cart-page-item-card">
              
              {/* Product Image with Error Handling */}
              <img 
                src={getImageUrl(item.product.images?.[0]?.url)} 
                alt={item.product.name}
                // Fallback if image fails to load
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/150?text=No+Image"; 
                }}
                className="cart-page-item-image" 
              />
              
              {/* Product Details (Name, Price, Stock) */}
              <div className="cart-page-item-details">
                <h3>{item.product.name}</h3>
                <p className="cart-page-item-price">Price: ₹{item.price}</p>
                
                {/* Low Stock Warning Alert */}
                {item.product.stock < 5 && (
                   <span className="cart-page-stock-warning">
                     Only {item.product.stock} left in stock!
                   </span>
                )}
              </div>
              
              {/* Quantity Controls (+ / -) */}
              <div className="cart-page-qty-box">
                <button 
                  className="cart-page-qty-btn"
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <FaMinus size={12} />
                </button>
                
                <span className="cart-page-qty-value">{item.quantity}</span>
                
                <button 
                  className="cart-page-qty-btn"
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                  aria-label="Increase quantity"
                >
                  <FaPlus size={12} />
                </button>
              </div>
              
              {/* Item Total Price */}
              <div className="cart-page-row-total">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
              
              {/* Delete Button */}
              <button 
                onClick={() => removeFromCart(item._id)} 
                className="cart-page-remove-btn"
                title="Remove Item"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        
        {/* === RIGHT COLUMN: Order Summary Box === */}
        <div className="cart-page-summary-section">
          <h3 className="cart-page-summary-title">Order Summary</h3>
          
          <div className="cart-page-summary-row">
            {/* Calculate total item count */}
            <span>Items ({cart.items.reduce((acc, item) => acc + item.quantity, 0)}):</span>
            <span>₹{cart.totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="cart-page-summary-row">
            <span>Shipping:</span>
            {/* Conditional Styling for Free Shipping */}
            <span style={{color: cart.totalAmount > 500 ? '#27ae60' : 'inherit', fontWeight: cart.totalAmount > 500 ? 'bold' : 'normal'}}>
              {cart.totalAmount > 500 ? 'FREE' : '₹50.00'}
            </span>
          </div>
          
          <div className="cart-page-summary-row">
            <span>Tax (18%):</span>
            <span>₹{(cart.totalAmount * 0.18).toFixed(2)}</span>
          </div>
          
          {/* Grand Total Calculation */}
          <div className="cart-page-summary-total">
            <span>Order Total:</span>
            <span>
              ₹{(cart.totalAmount + (cart.totalAmount > 500 ? 0 : 50) + cart.totalAmount * 0.18).toFixed(2)}
            </span>
          </div>
          
          {/* Action Buttons */}
          <button 
            onClick={() => navigate('/checkout')} 
            className="cart-page-btn cart-page-btn-primary"
          >
            Proceed to Checkout
          </button>
          
          <button 
            onClick={clearCart} 
            className="cart-page-btn cart-page-btn-secondary"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;