const { callGeminiWithRetry, fallbackChatReply } = require('../utils/geminiHelper');

const getChatReply = async (message) => {
  const prompt = `You are a friendly and knowledgeable AI career advisor. The user asks: "${message}"\nGive a helpful, practical, and encouraging response in 2-4 sentences. Focus on actionable career advice.`;

  try {
    return await callGeminiWithRetry(prompt);
  } catch (err) {
    const is429 = err?.status === 429 || err?.message?.includes('429');
    if (is429) {
      return fallbackChatReply(message);
    }
    throw err;
  }
};

module.exports = {
  getChatReply,
};
