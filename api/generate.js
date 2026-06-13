console.log("API Key loded:", process.env.OPENROUTER_API_KEY ? "Yes" : "No");
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.OPENROUTER_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { prompt } = req.body;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY,
        'HTTP-Referer': 'https://writeai-pro.vercel.app',
        'X-Title': 'WriteAI Pro'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800
      })
    });
    const data = await response.json();
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }
    const text = data.choices?.[0]?.message?.content || 'Error generating content.';
    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
