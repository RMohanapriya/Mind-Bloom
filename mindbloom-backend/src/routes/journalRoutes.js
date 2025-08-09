// mindbloom-backend/src/routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware'); // Corrected path and import syntax
const JournalEntry = require('../models/JournalEntry'); // Correct path

router.post('/', protect, asyncHandler(async (req, res) => {
    const { text, analysis } = req.body;
    if (!text || !analysis) {
        res.status(400);
        throw new Error('Please add all fields');
    }
    const entry = await JournalEntry.create({
        text,
        analysis,
        user: req.user.id,
    });
    res.status(201).json(entry);
}));

router.get('/', protect, asyncHandler(async (req, res) => {
    const entries = await JournalEntry.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(entries);
}));

module.exports = router;
