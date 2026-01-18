const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getTopProducts, // Ensures the "Port 5000" error is fixed
  addReview
} = require('../controllers/productController');

// Check your auth middleware file name! 
// Usually it is 'authMiddleware.js' or 'auth.js'. 
// Adjust the require path below if your file is named differently.
const { protect, admin } = require('../middleware/auth'); 

// --- PUBLIC ROUTES ---
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/top', getTopProducts); // Must be before /:id

// --- PROTECTED / ADMIN ROUTES ---
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// --- REVIEWS ---
router.post('/:id/reviews', protect, addReview);

// --- GET SINGLE PRODUCT (MUST BE LAST) ---
router.get('/:id', getProduct);

module.exports = router;