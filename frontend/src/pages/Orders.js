import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import './Orders.css';

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

  if (loading) return <div className="ec-orders-loading">Loading...</div>;

  return (
    <div className="ec-orders-page container">
      <h1 className="ec-orders-title">My Orders</h1>

      {orders.length === 0 ? (
        <div className="ec-orders-empty">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="ec-orders-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="ec-orders-list">
          {orders.map(order => (
            <Link
              to={`/orders/${order._id}`}
              key={order._id}
              className="ec-orders-card"
            >
              <div className="ec-orders-header">
                <div>
                  <strong>
                    Order #{order._id.substring(0, 8)}
                  </strong>
                  <span
                    className={`ec-orders-status ec-status-${order.orderStatus.toLowerCase()}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <span className="ec-orders-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="ec-orders-items">
                {order.orderItems.slice(0, 3).map((item, idx) => (
                  <span key={idx}>
                    {item.name}
                    {idx < order.orderItems.length - 1 && idx < 2 ? ', ' : ''}
                  </span>
                ))}
                {order.orderItems.length > 3 && (
                  <span> +{order.orderItems.length - 3} more</span>
                )}
              </div>

              <div className="ec-orders-total">
                Total: ₹{order.grandTotal}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
