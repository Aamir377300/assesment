const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getMe,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { authenticate, authorizeRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Current user profile
router.get('/me', getMe);

// Admin only routes
router.get('/', authorizeRole('admin'), getAllUsers);
router.get('/:id', authorizeRole('admin'), getUserById);
router.put('/:id/role', authorizeRole('admin'), updateUserRole);
router.delete('/:id', authorizeRole('admin'), deleteUser);

module.exports = router;
