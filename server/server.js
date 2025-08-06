const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
console.log('Loaded ENV:', process.env);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT; // Default fallback

// Check for essential env vars
if (!process.env.CLIENT_URL) {
    console.warn('⚠️ Warning: CLIENT_URL is not defined in .env');
}
if (!process.env.BASE_URL) {
    console.warn('⚠️ Warning: BASE_URL is not defined in .env');
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(bodyParser.json());

// Health check route
app.get('/', (req, res) => {
    res.send(`✅ Backend server is running on port ${PORT}`);
});

// API routes
app.use('/api', authRouter);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
    console.log(`🌐 API Base URL: ${process.env.BASE_URL}`);
});
