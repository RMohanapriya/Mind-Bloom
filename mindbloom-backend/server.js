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
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Allows parsing of JSON request bodies
app.use(cors()); // Enables Cross-Origin Resource Sharing

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

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