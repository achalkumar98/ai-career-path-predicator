const chatService = require('../services/chat.service');

const postChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Invalid message' });
    }

    const reply = await chatService.getChatReply(message);
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ message: 'Failed to get response from AI' });
  }
};

module.exports = {
  postChat,
};
