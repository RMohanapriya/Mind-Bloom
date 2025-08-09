// mindbloom-backend/src/routes/trendsRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const JournalEntry = require('../models/JournalEntry');

// @desc    Get all journal entries for a user to analyze trends
// @route   GET /api/trends
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    // req.user is available from the protect middleware
    const entries = await JournalEntry.find({ user: req.user.id }).sort({ date: 1 });
    res.status(200).json(entries);
}));

module.exports = router;
