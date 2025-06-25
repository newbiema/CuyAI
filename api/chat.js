const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Gemini API endpoint
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const { user_input } = req.body;

  if (!apiKey) {
    return res.status(500).send('API key tidak ditemukan');
  }

  const payload = {
    contents: [{ parts: [{ text: user_input }] }]
  };

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );
    
    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      return res.status(geminiResponse.status).send(`Gemini API error: ${errorData.error?.message || geminiResponse.statusText}`);
    }
    
    const data = await geminiResponse.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || '⚠️ Tidak ada respon dari AI.';
    res.status(200).send(result);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send(`Terjadi kesalahan server: ${err.message}`);
  }
});

module.exports = app;