const Insight = require('../models/Insights');
const Assessment = require('../models/Assessment');
const { callGeminiWithRetry, fallbackPersonalityInsight } = require('../utils/geminiHelper');

const createInsight = async (userId, input) => {
  const assessments = await Assessment.find({ userId }).sort({ createdAt: -1 }).limit(5);
  const historyText = assessments.length > 0
    ? assessments.map((a, i) => `Assessment ${i + 1}:\n- Skills: ${a.skills.join(', ') || 'None'}\n- Interests: ${a.interests.join(', ') || 'None'}\n- Recommended Careers: ${a.recommendedCareers.join(', ') || 'None'}`).join('\n')
    : 'No prior assessment history available.';

  const prompt = `You are a professional career advisor AI.\nThe user shared this input:\n"${input}"\nHere is their recent assessment history:\n${historyText}\nGenerate a personalized, warm, encouraging career insight in 2-3 paragraphs.`;

  let aiInsight;
  try {
    aiInsight = await callGeminiWithRetry(prompt);
  } catch (err) {
    const is429 = err?.status === 429 || err?.message?.includes('429');
    if (is429) {
      aiInsight = fallbackPersonalityInsight(input);
    } else {
      throw err;
    }
  }

  const newInsight = new Insight({ userId, userInput: input, aiInsight });
  await newInsight.save();
  return { insight: aiInsight };
};

module.exports = {
  createInsight,
};
