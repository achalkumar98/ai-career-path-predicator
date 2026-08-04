const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { callGeminiWithRetry, fallbackChatReply } = require('../utils/geminiHelper');

// POST /api/chat
router.post('/', authMiddleware, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const prompt = `You are a friendly and knowledgeable AI career advisor. 
The user asks: "${message}"
Give a helpful, practical, and encouraging response in 2-4 sentences. 
Focus on actionable career advice.`;

  let reply;
  try {
    reply = await callGeminiWithRetry(prompt);
    console.log('[Chat] Gemini response received');
  } catch (err) {
    const is429 = err?.status === 429 || err?.message?.includes('429');
    if (is429) {
      console.warn('[Chat] Gemini quota exhausted — using fallback');
      reply = fallbackChatReply(message);
    } else {
      console.error('Chat error:', err.message);
      return res.status(500).json({ error: 'Failed to get response from AI' });
    }
  }

  res.json({ reply });
});

module.exports = router;
