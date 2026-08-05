const chatService = require('../services/chat.service');

const postChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        message: 'Invalid message'
      });
    }

    const sessionId = req.user.id;
    const userName = req.user.name;

    const reply = await chatService.getChatReply(
      message,
      sessionId,
      userName
    );

    res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat error:', error);

    res.status(500).json({
      message: 'Failed to get response from AI'
    });
  }
};

module.exports = {
  postChat
};