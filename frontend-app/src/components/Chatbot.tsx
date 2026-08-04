'use client';
import { useState } from 'react';
import { sendChatMessageApi } from '@/api/chatApi';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';

export default function Chatbot() {
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) { alert('Speech recognition not supported in this browser.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => setChatMessage(event.results[0][0].transcript);
    recognition.start();
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setLoading(true);
    try {
      const res = await sendChatMessageApi(chatMessage);
      setChatResponse(res.data.reply);
    } catch (err) {
      console.error(err);
      alert('Chatbot error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass p-6">
        <form onSubmit={handleChatSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask anything about your career..."
              className="input-dark flex-1"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className="px-4 py-2 rounded-lg transition-all duration-200 flex-shrink-0"
              style={{
                background: isListening ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,255,0.1)',
                border: `1px solid ${isListening ? 'rgba(239,68,68,0.3)' : 'rgba(0,212,255,0.2)'}`,
                color: isListening ? '#f87171' : 'var(--accent)',
              }}
              title="Voice input"
            >
              <FaMicrophone size={16} />
            </button>
          </div>
          <button type="submit" disabled={loading} className="btn-accent w-full py-3 flex items-center justify-center gap-2">
            <FaPaperPlane size={14} />
            {loading ? 'Thinking...' : 'Send Message'}
          </button>
        </form>
      </div>

      {chatResponse && (
        <div className="glass p-6">
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--accent)' }}>🤖 CAREERBOT RESPONSE</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{chatResponse}</p>
        </div>
      )}
    </div>
  );
}
