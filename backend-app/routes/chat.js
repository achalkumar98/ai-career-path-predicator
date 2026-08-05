
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { callGroqWithRetry, fallbackChatReply } = require('../utils/groqHelper');

// In-memory session storage
const sessionMemory = new Map();

// Helper to get or create session for user
const getOrCreateSession = (userId) => {
  if (!sessionMemory.has(userId)) {
    sessionMemory.set(userId, {
      userId,
      messages: [],
      context: {},
      lastInteraction: Date.now(),
      conversationStart: Date.now()
    });
  }
  return sessionMemory.get(userId);
};

// Helper to update session with new message
const updateSession = (userId, userMessage, assistantReply) => {
  const session = getOrCreateSession(userId);
  session.messages.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  });
  session.messages.push({
    role: 'assistant',
    content: assistantReply,
    timestamp: Date.now()
  });
  
  if (session.messages.length > 20) {
    session.messages = session.messages.slice(-20);
  }
  
  session.lastInteraction = Date.now();
  sessionMemory.set(userId, session);
  return session;
};

// GET /api/chat - Get chat history and personalized greeting
router.get('/', authMiddleware, async (req, res) => {
  try {

    const userId = req.user.id;
    
    
    // Get user info from the token
    const user = req.user;
   
    
    const session = getOrCreateSession(userId);
    
    // Get user name from token or use default
    const userName = user.name || user.userName || user.email?.split('@')[0] || 'there';
  
    
    const messageCount = session.messages.length;
    
    let greeting = `Hello ${userName}! 👋 `;
    
    if (messageCount === 0) {
      greeting += `Welcome to your career advisor! I'm here to help you with your career goals, resume advice, interview preparation, and professional development. What would you like to discuss today?`;
    } else {
      greeting += `Welcome back! How can I continue helping you with your career journey today?`;
    }
    
    res.json({ 
      greeting,
      messageCount: Math.floor(messageCount / 2), // Each exchange has 2 messages
      history: session.messages.slice(-10) // Return last 10 messages for context
    });
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

// POST /api/chat
router.post('/', authMiddleware, async (req, res) => {
  const { message } = req.body;
  // FIXED: Use req.user.id instead of req.user._id
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Get user session
  const session = getOrCreateSession(userId);
  const user = req.user;
  const userName = user.name || user.username || user.email?.split('@')[0] || 'there';

  // Build context-aware prompt with session memory
  let contextPrompt = `You are a friendly and knowledgeable AI career advisor. `;
  contextPrompt += `You're speaking with ${userName}. `;
  
  if (session.messages.length > 0) {
    contextPrompt += `\n\nConversation history:\n`;
    const recentMessages = session.messages.slice(-10);
    recentMessages.forEach(msg => {
      const role = msg.role === 'user' ? `${userName}` : 'Advisor';
      contextPrompt += `${role}: ${msg.content}\n`;
    });
    contextPrompt += `\n`;
  }
  
  contextPrompt += `The user asks: "${message}"\n\n`;
  contextPrompt += `Give a helpful, practical, and encouraging response in 2-4 sentences. 
Focus on actionable career advice. Consider the conversation history and provide 
personalized guidance.`;

  let reply;
  try {
    reply = await callGroqWithRetry(contextPrompt);
    
  } catch (err) {
    const is429 = err?.status === 429 || err?.message?.includes('429');
    if (is429) {
      console.warn('[Chat] Groq quota exhausted — using fallback');
      reply = fallbackChatReply(message);
    } else {
      console.error('Chat error:', err.message);
      return res.status(500).json({ error: 'Failed to get response from AI' });
    }
  }

  updateSession(userId, message, reply);

  res.json({ 
    reply,
    messageCount: Math.floor(session.messages.length / 2)
  });
});

// DELETE /api/chat - Clear chat history
router.delete('/', authMiddleware, async (req, res) => {
  try {
    // FIXED: Use req.user.id instead of req.user._id
    const userId = req.user.id;
    if (sessionMemory.has(userId)) {
      sessionMemory.delete(userId);
      res.json({ message: 'Chat history cleared successfully' });
    } else {
      res.json({ message: 'No chat history found' });
    }
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

// Cleanup old sessions every hour
const cleanupOldSessions = () => {
  const now = Date.now();
  const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
  
  for (const [userId, session] of sessionMemory.entries()) {
    if (now - session.lastInteraction > SESSION_TIMEOUT) {
      sessionMemory.delete(userId);
      console.log(`Cleaned up session for user: ${userId}`);
    }
  }
};

setInterval(cleanupOldSessions, 60 * 60 * 1000);

module.exports = router;