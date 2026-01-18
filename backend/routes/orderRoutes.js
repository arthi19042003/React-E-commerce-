const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getOrder, 
  getAllOrders, 
  updateOrderStatus,
  cancelOrder,
  getOrderStats, // Make sure this is imported
  getMyOrders 
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// 1. General Routes (Must be at the top)
router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.route('/myorders').get(protect, getMyOrders);

// 2. STATS ROUTE (MUST BE BEFORE /:id) <--- THIS IS YOUR FIX
router.route('/stats').get(protect, admin, getOrderStats);

// 3. Specific ID Routes (Must be at the bottom)
router.route('/:id').get(protect, getOrder);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/cancel').put(protect, cancelOrder);

module.exports = router;