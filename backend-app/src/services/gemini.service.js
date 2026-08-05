const { callGeminiWithRetry, fallbackCareerInsight } = require('../utils/geminiHelper');

const getCareerInsight = async (skills, interests) => {
  const prompt = `A user has the following skills: ${skills.join(', ')}. And they are interested in: ${interests.join(', ')}. Based on this, suggest 2-3 career paths that would suit them best.`;
  try {
    return await callGeminiWithRetry(prompt);
  } catch (err) {
    const is429 = err?.status === 429 || err?.message?.includes('429');
    if (is429) return fallbackCareerInsight(skills, interests);
    throw err;
  }
};

module.exports = {
  getCareerInsight,
};
