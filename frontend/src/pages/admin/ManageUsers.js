import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../../services/api';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => { loadUsers(); }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
  };

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.users);
    } catch (e) { console.error('Error'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete User?')) {
      try {
        await deleteUser(id);
        showPopup('User deleted successfully!');
        loadUsers();
      } catch (e) { showPopup('Failed to delete', 'error'); }
    }
  };

  return (
    <div className="mu-wrapper">
      {popup.show && (
        <div className="mu-overlay">
          <div className="mu-popup">
             <div className="mu-icon"><FaCheck /></div>
             <p>{popup.message}</p>
          </div>
        </div>
      )}
      <div className="mu-header"><h1>Manage Users</h1></div>
      <div className="mu-table-box">
        <table className="mu-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                <td><button className="mu-btn-del" onClick={()=>handleDelete(u._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

};
export default ManageUsers;