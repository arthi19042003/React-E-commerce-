import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder, cancelOrder } from '../services/api';
import './OrderDetail.css'; // Importing the unique CSS

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        alert('Order cancelled successfully');
        loadOrder();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  if (loading) return <div className="order-detail-page-loading">Loading order details...</div>;
  if (!order) return <div className="order-detail-page-error">Order not found</div>;

  const canCancel = ['Pending', 'Processing'].includes(order.orderStatus);

  return (
    <div className="order-detail-page-container">
      <h1 className="order-detail-page-title">Order Details</h1>
      
      {/* Top Grid: Info & Shipping */}
      <div className="order-detail-page-grid">
        
        {/* Left: Order Info */}
        <div className="order-detail-page-card">
          <h3>Order Information</h3>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p>
            <strong>Status:</strong> 
            <span className={`order-detail-page-badge order-detail-page-status-${order.orderStatus.toLowerCase()}`}>
              {order.orderStatus}
            </span>
          </p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
          
          {canCancel && (
            <button onClick={handleCancelOrder} className="order-detail-page-btn-cancel">
              Cancel Order
            </button>
          )}
        </div>
        
        {/* Right: Shipping Info */}
        <div className="order-detail-page-card">
          <h3>Shipping Address</h3>
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
          <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
          <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
        </div>
      </div>
      
      {/* Bottom: Items & Totals */}
      <div className="order-detail-page-card">
        <h3>Order Items</h3>
        
        {order.orderItems.map((item, idx) => (
          <div key={idx} className="order-detail-page-item-row">
            <div className="order-detail-page-item-info">
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="order-detail-page-item-img"
                />
              )}
              <div className="order-detail-page-item-text">
                <strong>{item.name}</strong>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
            <div className="order-detail-page-item-price">
              ₹{item.price * item.quantity}
            </div>
          </div>
        ))}
        
        <div className="order-detail-page-totals-box">
          <div className="order-detail-page-total-row">
            <span>Subtotal:</span>
            <span>₹{order.totalAmount}</span>
          </div>
          <div className="order-detail-page-total-row">
            <span>Shipping:</span>
            <span>₹{order.shippingCost}</span>
          </div>
          <div className="order-detail-page-total-row">
            <span>Tax:</span>
            <span>₹{order.taxAmount}</span>
          </div>
          <div className="order-detail-page-grand-total">
            <span>Grand Total:</span>
            <span>₹{order.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;