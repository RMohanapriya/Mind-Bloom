// mindbloom-backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Import the middleware

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires a valid JWT)
router.get('/profile', protect, (req, res) => {
  // If the middleware passes, req.user will contain the user's details
  res.status(200).json({
    _id: req.user.id,
    email: req.user.email,
    createdAt: req.user.createdAt,
  });
});

module.exports = router;