import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './ManageOrders.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => { loadOrders(); }, [filter]);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
  };

  const loadOrders = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const res = await getAllOrders(params);
      setOrders(res.data.orders);
    } catch (error) { console.error('Error'); } finally { setLoading(false); }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showPopup('Order status updated!');
      loadOrders();
    } catch (error) {
      showPopup('Failed to update status', 'error');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="mo-wrapper">
      {popup.show && (
        <div className="mo-popup-overlay">
          <div className="mo-popup-box">
            <div className="mo-icon"><FaCheck /></div>
            <p className="mo-text">{popup.message}</p>
          </div>
        </div>
      )}
      <div className="mo-header">
        <h1>Manage Orders</h1>
        <select className="mo-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
      <div className="mo-table-container">
        <table className="mo-table">
          <thead><tr><th>ID</th><th>User</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.substring(0,8)}</td>
                <td>{order.user?.name}</td>
                <td>₹{order.grandTotal}</td>
                <td><span className={`mo-badge mo-status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></td>
                <td>
                  <select className="mo-select" value={order.orderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ManageOrders;