const {
  callGroqWithRetry,
  fallbackChatReply
} = require('../utils/groqHelper');

const chatMemory = require('../utils/chatMemory');

const getChatReply = async (
  message,
  sessionId,
  userName
) => {

  const history = chatMemory.getHistory(sessionId);

  const isFirstMessage = history.length === 0;

  const systemPrompt = `
You are CareerBot, an AI Career Assistant.

Rules:
- Be friendly, modern, and conversational.
- Keep answers concise (3-8 lines).
- Give practical and actionable advice.
- Use the user's name ONLY in the first greeting.
- Never repeatedly mention the user's name.
- Remember previous conversation context.
- Do not write long essays unless explicitly requested.
- Do not repeat information already discussed.
- Ask at most one follow-up question.
- Continue conversations naturally like ChatGPT.
- If the user is learning something, guide them step-by-step.
- When providing code, ALWAYS wrap code in markdown code blocks.
- Use bullet points when explaining roadmaps or learning paths.
`;

  let prompt;

  if (isFirstMessage) {

    prompt = `
${systemPrompt}

User Name: ${userName}

This is the first interaction.

Start with:

Hi ${userName}! 👋

Then answer the user's message naturally.

User Message:
${message}
`;

  } else {

    const previousConversation = history
      .slice(-5)
      .map(item => `
User: ${item.user}
Assistant: ${item.assistant}
`)
      .join('\n');

    prompt = `
${systemPrompt}

Previous Conversation:
${previousConversation}

Current User Message:
${message}

Instructions:
- Continue naturally from previous messages.
- Build on earlier discussion.
- Do not restart the conversation.
- Do not repeat previous explanations.
- Keep the response focused and helpful.

Reply:
`;
  }

  try {

    const reply = await callGroqWithRetry(prompt);

    chatMemory.addMessage(
      sessionId,
      message,
      reply
    );

    return reply;

  } catch (err) {

    console.error('Groq Error:', err);

    const reply = fallbackChatReply(message);

    chatMemory.addMessage(
      sessionId,
      message,
      reply
    );

    return reply;
  }
};

module.exports = {
  getChatReply
};