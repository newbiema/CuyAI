const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));


app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const { user_input } = req.body;

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
    const data = await geminiResponse.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || '⚠️ Tidak ada respon dari AI.';
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
