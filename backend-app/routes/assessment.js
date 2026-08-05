const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Assessment = require('../models/Assessment');
const Insights = require('../models/Insights');
const { callGeminiWithRetry, fallbackCareerInsight } = require('../utils/geminiHelper');

// POST /api/assessment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { skills = [], interests = [] } = req.body;

    if (!Array.isArray(skills) || !Array.isArray(interests)) {
      return res.status(400).json({ message: 'Invalid skills or interests format' });
    }

    const prompt = `
A user has the following skills: ${skills.join(', ')}.
And they are interested in: ${interests.join(', ')}.

Based on this, suggest 2-3 career paths that would suit them best.
Keep the answer friendly and 1 paragraph long, and explain briefly why these paths match their profile.
    `.trim();

    let insightText;
    try {
      insightText = await callGeminiWithRetry(prompt);
      console.log('[Assessment] Gemini response received');
    } catch (aiErr) {
      const is429 = aiErr?.status === 429 || aiErr?.message?.includes('429');
      if (is429) {
        console.warn('[Assessment] Gemini quota exhausted — using fallback');
        insightText = fallbackCareerInsight(skills, interests);
      } else {
        throw aiErr;
      }
    }

    const recommendedCareers = insightText
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const newAssessment = new Assessment({
      userId: req.user,
      skills,
      interests,
      recommendedCareers,
    });
    await newAssessment.save();

    res.status(200).json({ insight: insightText });
  } catch (error) {
    console.error('Assessment error:', error.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// GET /api/assessment/history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const assessments = await Assessment.find({ userId }).sort({ createdAt: -1 });
    const insight = await Insights.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ assessments, insight });
  } catch (err) {
    console.error('History fetch error:', err.message);
    res.status(500).json({ error: 'Server error while fetching assessment history.' });
  }
});

module.exports = router;
