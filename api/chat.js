export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

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
    res.status(500).send('Terjadi kesalahan server.');
  }
}
