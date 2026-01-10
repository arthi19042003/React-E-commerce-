import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';

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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary mt-2">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <Link to={`/orders/${order._id}`} key={order._id} className="order-card card">
              <div className="order-header">
                <div>
                  <strong>Order #{order._id.substring(0, 8)}</strong>
                  <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="order-items">
                {order.orderItems.slice(0, 3).map((item, idx) => (
                  <span key={idx}>{item.name}{idx < 2 && idx < order.orderItems.length - 1 ? ', ' : ''}</span>
                ))}
                {order.orderItems.length > 3 && <span> +{order.orderItems.length - 3} more</span>}
              </div>
              <div className="order-total">
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