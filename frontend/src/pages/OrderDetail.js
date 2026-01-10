import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder, cancelOrder } from '../services/api';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await getOrder(id);
      setOrder(res.data.order);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder(id);
        toast.success('Order cancelled successfully');
        loadOrder();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!order) return <div className="error">Order not found</div>;

  const canCancel = ['Pending', 'Processing'].includes(order.orderStatus);

  return (
    <div className="container">
      <h1 className="page-title">Order Details</h1>
      <div className="order-detail-grid">
        <div className="order-info card">
          <h3>Order Information</h3>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
          
          {canCancel && (
            <button onClick={handleCancelOrder} className="btn btn-danger mt-2">Cancel Order</button>
          )}
        </div>
        
        <div className="shipping-info card">
          <h3>Shipping Address</h3>
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
          <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
          <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
        </div>
      </div>
      
      <div className="order-items card mt-3">
        <h3>Order Items</h3>
        {order.orderItems.map((item, idx) => (
          <div key={idx} className="order-item-row">
            <div className="item-info">
              {item.image && <img src={item.image} alt={item.name} style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} />}
              <div>
                <strong>{item.name}</strong>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
            <div className="item-price">₹{item.price * item.quantity}</div>
          </div>
        ))}
        
        <hr />
        <div className="order-totals">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>₹{order.totalAmount}</span>
          </div>
          <div className="total-row">
            <span>Shipping:</span>
            <span>₹{order.shippingCost}</span>
          </div>
          <div className="total-row">
            <span>Tax:</span>
            <span>₹{order.taxAmount}</span>
          </div>
          <div className="total-row grand-total">
            <strong>Grand Total:</strong>
            <strong>₹{order.grandTotal}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;