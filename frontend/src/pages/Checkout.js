import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../services/api';
import { toast } from 'react-toastify';
import './Checkout.css'; // Don't forget to import the CSS file!

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '',
    paymentMethod: 'COD',
    orderNotes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createOrder({
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        orderNotes: formData.orderNotes
      });
      
      toast.success('Order placed successfully!');
      await clearCart();
      navigate(`/orders/${res.data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      
      <div className="checkout-layout">
        
        {/* LEFT COLUMN: FORM */}
        <form onSubmit={handleSubmit} className="checkout-card">
          <h3 className="checkout-subtitle">Shipping Address</h3>
          
          <div className="checkout-form-group">
            <label className="checkout-label">Street Address *</label>
            <input type="text" className="checkout-input" required
              value={formData.street}
              onChange={(e) => setFormData({...formData, street: e.target.value})}
            />
          </div>
          
          <div className="checkout-form-row">
            <div className="checkout-form-group">
              <label className="checkout-label">City *</label>
              <input type="text" className="checkout-input" required
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div className="checkout-form-group">
              <label className="checkout-label">State *</label>
              <input type="text" className="checkout-input" required
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
              />
            </div>
          </div>
          
          <div className="checkout-form-row">
            <div className="checkout-form-group">
              <label className="checkout-label">ZIP Code *</label>
              <input type="text" className="checkout-input" required
                value={formData.zipCode}
                onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              />
            </div>
            <div className="checkout-form-group">
              <label className="checkout-label">Phone *</label>
              <input type="tel" className="checkout-input" required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          
          <h3 className="checkout-subtitle mt-3">Payment Method</h3>
          <div className="checkout-payment-box">
            <label className="checkout-radio-label">
              <input type="radio" name="payment" value="COD" checked={formData.paymentMethod === 'COD'}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              />
              Cash on Delivery
            </label>
          </div>
          
          <div className="checkout-form-group">
            <label className="checkout-label">Order Notes (Optional)</label>
            <textarea className="checkout-input checkout-textarea" rows="3"
              value={formData.orderNotes}
              onChange={(e) => setFormData({...formData, orderNotes: e.target.value})}
            />
          </div>
          
          <button type="submit" className="checkout-btn">Place Order</button>
        </form>
        
        {/* RIGHT COLUMN: SUMMARY */}
        <div className="checkout-card">
          <h3 className="checkout-subtitle">Order Summary</h3>
          <div className="checkout-summary-list">
            {cart.items.map(item => (
              <div key={item._id} className="checkout-summary-item">
                <span>{item.product.name} <small>x {item.quantity}</small></span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="checkout-divider"></div>
          
          <div className="checkout-summary-row">
            <span>Subtotal:</span>
            <span>₹{cart.totalAmount}</span>
          </div>
          <div className="checkout-summary-row">
            <span>Shipping:</span>
            <span>₹{cart.totalAmount > 500 ? 0 : 50}</span>
          </div>
          <div className="checkout-summary-row">
            <span>Tax (18%):</span>
            <span>₹{(cart.totalAmount * 0.18).toFixed(2)}</span>
          </div>
          
          <div className="checkout-divider"></div>
          
          <div className="checkout-total">
            <span>Total:</span>
            <span>₹{(cart.totalAmount + (cart.totalAmount > 500 ? 0 : 50) + cart.totalAmount * 0.18).toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;