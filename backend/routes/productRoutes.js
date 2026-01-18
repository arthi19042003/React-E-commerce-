const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  addReview
} = require('../controllers/productController');

// Importing 'admin' here means it must be exported in auth.js
const { protect, admin } = require('../middleware/auth'); 

// Public Routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Admin Routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// Protected User Route
router.post('/:id/reviews', protect, addReview);

module.exports = router;