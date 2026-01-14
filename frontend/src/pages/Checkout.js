import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../services/api';
import { toast } from 'react-toastify';
import './Checkout.css'; // ✅ UNIQUE CSS FILE

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
    // ✅ PAGE LEVEL SCOPING CLASS (IMPORTANT)
    <div className="ec-checkout-page container">

      <h1 className="page-title">Checkout</h1>

      <div className="checkout-grid">

        {/* ================= LEFT: FORM ================= */}
        <form onSubmit={handleSubmit} className="checkout-form card">

          <h3>Shipping Address</h3>

          <div className="form-group">
            <label>Street Address *</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ZIP Code *</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                className="form-control"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <h3 className="mt-3">Payment Method</h3>

          <div className="payment-methods">
            <label className="radio-label">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={formData.paymentMethod === 'COD'}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value })
                }
              />
              Cash on Delivery
            </label>
          </div>

          <div className="form-group">
            <label>Order Notes (Optional)</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.orderNotes}
              onChange={(e) =>
                setFormData({ ...formData, orderNotes: e.target.value })
              }
            />
          </div>

          <button type="submit" className="btn btn-success btn-block">
            Place Order
          </button>
        </form>

        {/* ================= RIGHT: SUMMARY ================= */}
        <div className="order-summary card">

          <h3>Order Summary</h3>

          {cart.items.map((item) => (
            <div key={item._id} className="summary-item">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr />

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
            <strong>
              ₹
              {(
                cart.totalAmount +
                (cart.totalAmount > 500 ? 0 : 50) +
                cart.totalAmount * 0.18
              ).toFixed(2)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
