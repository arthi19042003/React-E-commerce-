import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import './Orders.css'; // Importing the unique CSS

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="orders-page-loading">Loading your orders...</div>;

  return (
    <div className="orders-page-container">
      <h1 className="orders-page-title">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="orders-page-empty">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="orders-page-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-page-list">
          {orders.map(order => (
            <Link to={`/orders/${order._id}`} key={order._id} className="orders-page-card">
              
              <div className="orders-page-header">
                <div>
                  <strong>Order #{order._id.substring(0, 8)}</strong>
                  {/* Dynamic class generation with prefix */}
                  <span className={`orders-page-badge orders-page-status-${order.orderStatus.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="orders-page-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="orders-page-items">
                {order.orderItems.slice(0, 3).map((item, idx) => (
                  <span key={idx}>
                    {item.name}
                    {idx < 2 && idx < order.orderItems.length - 1 ? ', ' : ''}
                  </span>
                ))}
                {order.orderItems.length > 3 && <span> +{order.orderItems.length - 3} more</span>}
              </div>
              
              <div className="orders-page-total">
                <strong>Total: ₹{order.grandTotal}</strong>
              </div>
              
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;