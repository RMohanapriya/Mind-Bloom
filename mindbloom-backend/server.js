// mindbloom-backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import your route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 10000; // Render uses port 10000 by default

// Middleware
app.use(express.json()); // Allows parsing of JSON request bodies

// Configure CORS to only allow your Netlify frontend URL
const allowedOrigins = [
  'http://localhost:3000',
  'https://our-mind-bloom.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Define your API routes
app.use('/api/auth', authRoutes);  // All authentication routes start with /api/auth
app.use('/api/users', userRoutes); // All user-related routes start with /api/users

// Test endpoint
app.get('/', (req, res) => {
  res.send('MindBloom Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
