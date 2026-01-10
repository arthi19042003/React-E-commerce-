import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container text-center" style={{padding: '4rem'}}>
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary mt-2">Continue Shopping</Link>
      </div>
    );
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItem(itemId, newQuantity);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Shopping Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item._id} className="cart-item card">
              <img src={item.product.images?.[0]?.url} alt={item.product.name} />
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p className="item-price">₹{item.price}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>
                  <FaMinus />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>
                  <FaPlus />
                </button>
              </div>
              <div className="item-total">₹{item.price * item.quantity}</div>
              <button onClick={() => removeFromCart(item._id)} className="btn-icon">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{cart.totalAmount}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>₹{cart.totalAmount > 500 ? 0 : 50}</span>
          </div>
          <div className="summary-row">
            <span>Tax (18%):</span>
            <span>₹{(cart.totalAmount * 0.18).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <strong>Total:</strong>
            <strong>₹{(cart.totalAmount + (cart.totalAmount > 500 ? 0 : 50) + cart.totalAmount * 0.18).toFixed(2)}</strong>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-block">
            Proceed to Checkout
          </button>
          <button onClick={clearCart} className="btn btn-secondary btn-block mt-2">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;