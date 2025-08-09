// mindbloom-backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Corrected import paths to point to the correct location
const authRoutes = require('.src/routes/authRoutes');
const userRoutes = require('.src/routes/userRoutes');
const trendsRoutes = require('.src/routes/trendsRoutes');
const journalRoutes = require('.src/routes/journalRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'https://our-mind-bloom.netlify.app'
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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/journal', journalRoutes);

app.get('/', (req, res) => {
  res.send('MindBloom Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
