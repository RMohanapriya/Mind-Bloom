// mindbloom-backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');

// This is a placeholder route to get user data
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
    // The protect middleware adds the user object to the request
    res.json({
        id: req.user._id,
        email: req.user.email,
    });
}));

module.exports = router;
