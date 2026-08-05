class ChatMemory {

  constructor() {
    this.sessions = new Map();
    this.maxHistory = 10;
  }

  getHistory(sessionId) {

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
    }

    return this.sessions.get(sessionId);
  }

  addMessage(sessionId, userMsg, assistantMsg) {

    const history = this.getHistory(sessionId);

    history.push({
      user: userMsg,
      assistant: assistantMsg,
      timestamp: Date.now()
    });

    if (history.length > this.maxHistory) {
      history.shift();
    }
  }

  clear(sessionId) {
    this.sessions.delete(sessionId);
  }
}

module.exports = new ChatMemory();