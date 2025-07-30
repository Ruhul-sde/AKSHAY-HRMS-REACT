const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route - avoid "Cannot GET /"
app.get('/', (req, res) => {
    res.send('Backend server is running');
});

// API routes
app.use('/api', authRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
