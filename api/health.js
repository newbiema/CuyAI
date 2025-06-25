import express from 'express';

const app = express();

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

export default app;