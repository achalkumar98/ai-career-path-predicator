const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Insight = require('../models/Insights');
const Assessment = require('../models/Assessment');
const { callGroqWithRetry, fallbackPersonalityInsight } = require('../utils/groqHelper');

// POST /api/insights
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ message: 'Input is required.' });

    const assessments = await Assessment.find({ userId: req.user }).sort({ createdAt: -1 }).limit(5);
    const historyText = assessments.length > 0
      ? assessments.map((a, i) => `Assessment ${i + 1}:
- Skills: ${a.skills.join(', ') || 'None'}
- Interests: ${a.interests.join(', ') || 'None'}
- Recommended Careers: ${a.recommendedCareers.join(', ') || 'None'}`).join('\n')
      : 'No prior assessment history available.';

    const prompt = `
You are a professional career advisor AI.
The user shared this input:
"${input}"
Here is their recent assessment history:
${historyText}
Generate a personalized, warm, encouraging career insight in 2-3 paragraphs.
    `.trim();

    let aiInsight;
    try {
      aiInsight = await callGroqWithRetry(prompt);
      console.log('[Insights] Groq response received');
    } catch (aiErr) {
      const is429 = aiErr?.status === 429 || aiErr?.message?.includes('429');
      if (is429) {
        console.warn('[Insights] Groqquota exhausted — using fallback');
        aiInsight = fallbackPersonalityInsight(input);
      } else {
        throw aiErr;
      }
    }

    const newInsight = new Insight({ userId: req.user, userInput: input, aiInsight });
    await newInsight.save();

    res.status(200).json({ insight: aiInsight });
  } catch (err) {
    console.error('Insight generation failed:', err.message);
    res.status(500).json({ message: 'Internal server error while generating insight.' });
  }
});

module.exports = router;
