import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import './Cart.css'; 

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="ec-cart-page ec-cart-empty">
        <h2>Your cart is empty</h2>
        <p>Check out our latest products and find something you love.</p>
        <Link to="/products" className="ec-cart-btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItem(itemId, newQuantity);
    }
  };

  return (
    <div className="ec-cart-page">
      <h1 className="ec-cart-title">Shopping Cart</h1>

      <div className="ec-cart-content">
        {/* LEFT: ITEMS */}
        <div className="ec-cart-items">
          {cart.items.map(item => (
            <div key={item._id} className="ec-cart-item">
              <img
                src={item.product.images?.[0]?.url || '/placeholder.png'}
                alt={item.product.name}
              />

              <div className="ec-cart-item-details">
                <h3>{item.product.name}</h3>
                <p className="ec-cart-item-price">₹{item.price}</p>

                {item.product.stock < 5 && (
                  <span className="ec-cart-low-stock">
                    Only {item.product.stock} left!
                  </span>
                )}
              </div>

              <div className="ec-cart-qty">
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <FaMinus />
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                >
                  <FaPlus />
                </button>
              </div>

              <div className="ec-cart-item-total">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="ec-cart-remove-btn"
                title="Remove item"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="ec-cart-summary">
          <h3>Order Summary</h3>

          <div className="ec-cart-row">
            <span>
              Items ({cart.items.reduce((a, i) => a + i.quantity, 0)})
            </span>
            <span>₹{cart.totalAmount.toFixed(2)}</span>
          </div>

          <div className="ec-cart-row">
            <span>Shipping</span>
            <span className={cart.totalAmount > 500 ? 'free' : ''}>
              {cart.totalAmount > 500 ? 'FREE' : '₹50.00'}
            </span>
          </div>

          <div className="ec-cart-row">
            <span>Tax (18%)</span>
            <span>₹{(cart.totalAmount * 0.18).toFixed(2)}</span>
          </div>

          <div className="ec-cart-row total">
            <strong>Order Total</strong>
            <strong>
              ₹{(cart.totalAmount + (cart.totalAmount > 500 ? 0 : 50) + cart.totalAmount * 0.18).toFixed(2)}
            </strong>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="ec-cart-btn-primary"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={clearCart}
            className="ec-cart-btn-secondary"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
