import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../services/api';
import './Checkout.css';

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

      alert('Order placed successfully!');
      await clearCart();
      navigate(`/orders/${res.data.order._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
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
        {/* LEFT COLUMN */}
        <form onSubmit={handleSubmit} className="checkout-card">
          <h3 className="checkout-subtitle">Shipping Address</h3>

          <input
            className="checkout-input"
            placeholder="Street Address"
            required
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          />

          <input
            className="checkout-input"
            placeholder="City"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />

          <input
            className="checkout-input"
            placeholder="State"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />

          <input
            className="checkout-input"
            placeholder="ZIP Code"
            required
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          />

          <input
            className="checkout-input"
            placeholder="Phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <button type="submit" className="checkout-btn">
            Place Order
          </button>
        </form>

        {/* RIGHT COLUMN */}
        <div className="checkout-card">
          <h3 className="checkout-subtitle">Order Summary</h3>

          {cart.items.map(item => (
            <div key={item._id} className="checkout-summary-item">
              <span>{item.product.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr />
          <strong>Total: ₹{cart.totalAmount}</strong>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
