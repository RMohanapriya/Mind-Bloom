// mindbloom-backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Make sure this path is correct

// Initialize the app
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// CORS configuration - ensure the origin is correct
const allowedOrigins = [
  'http://localhost:3000',
  'https://our-mind-bloom.netlify.app' // Make sure this is your exact Netlify URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('MindBloom Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
