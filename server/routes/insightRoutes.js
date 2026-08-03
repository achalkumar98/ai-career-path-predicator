const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const Insight = require('../models/Insights');
const Assessment = require('../models/Assessment'); // ensure this is imported
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ message: 'Input is required.' });

    const assessments = await Assessment.find({ userId: req.user }).sort({ createdAt: -1 }).limit(5);
    const historyText = assessments.length > 0
      ? assessments.map((a, i) => `Assessment ${i + 1}:
- Skills: ${a.skills.join(', ') || 'None'}
- Interests: ${a.interests.join(', ') || 'None'}
- Recommended Careers: ${a.recommendedCareers.join(', ') || 'None'}
- Previous Insight: ${a.insight || 'N/A'}`).join('\n')
      : 'No prior assessment history available.';

    const prompt = `
You are a professional career advisor AI.
The user shared this input:
"${input}"
Here is their recent assessment history:
${historyText}
Generate a personalized, warm, encouraging career insight.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const aiInsight = (await result.response).text().trim();

    const newInsight = new Insight({ userId: req.user, userInput: input, aiInsight });
    await newInsight.save();

    res.status(200).json({ insight: aiInsight });
  } catch (err) {
    console.error('Insight generation failed:', err);
    res.status(500).json({ message: 'Internal server error while generating insight.' });
  }
});

module.exports = router;
