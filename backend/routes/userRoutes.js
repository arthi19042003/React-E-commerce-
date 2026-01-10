const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController'); // <--- FIXED PATH (added ..)
const { protect, authorize } = require('../middleware/auth'); // <--- FIXED PATH (added ..)

router.get('/stats', protect, authorize('admin'), getUserStats);
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;