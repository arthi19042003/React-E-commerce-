const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController'); // <--- FIXED PATH (added ..)
const { protect, authorize } = require('../middleware/auth'); // <--- FIXED PATH (added ..)

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;