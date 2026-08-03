const express = require('express');
const router = express.Router();
const Replicate = require('replicate');
const dotenv = require('dotenv');
const authMiddleware = require('../middleware/authMiddleware');

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// @route   POST /api/chat
// @desc    Ask AI chatbot
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const prompt = `You are a career advisor. Answer this: ${message}`;

    const output = await replicate.run('meta/llama-2-7b-chat', {
      input: {
        prompt,
        temperature: 0.7,
        max_length: 300,
      },
    });

    const reply = Array.isArray(output) ? output.join('') : output;

    res.json({ reply });
  } catch (err) {
    console.error('Chatbot Error →', err);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

module.exports = router;
