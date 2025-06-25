// server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// API Routes
const chatRouter = require('./api/chat');
app.use('/api/chat', chatRouter);

// Handle SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Loaded' : 'Missing!'}`);
});