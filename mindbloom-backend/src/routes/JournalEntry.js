// mindbloom-backend/src/models/JournalEntry.js
const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
    text: { type: String, required: true },
    analysis: { type: Object, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: { type: Date, default: Date.now },
});

const JournalEntry = mongoose.model('JournalEntry', JournalEntrySchema);
module.exports = JournalEntry;
