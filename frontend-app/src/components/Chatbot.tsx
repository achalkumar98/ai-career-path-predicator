'use client';
import { useState } from 'react';
import { sendChatMessageApi } from '@/api/chatApi';
import toast from 'react-hot-toast';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
  start: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

export default function Chatbot() {
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognitionCtor = (
      (window as Window & { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition ||
      (window as Window & { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition
    );
    if (!SpeechRecognitionCtor) { toast.error('Speech recognition not supported in this browser.'); return; }
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => setChatMessage(event.results[0][0].transcript);
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
      toast.error('Chatbot error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div className="glass" style={{ padding: 'var(--space-7)' }}>
        <form onSubmit={handleChatSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask anything about your career..."
              className="input-dark"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              aria-label="Voice input"
              style={{
                flexShrink: 0,
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-xs)',
                border: `1px solid ${isListening ? 'rgba(220,38,38,0.3)' : 'var(--color-border-default)'}`,
                background: isListening ? 'rgba(220,38,38,0.06)' : 'var(--color-surface-muted)',
                color: isListening ? '#dc2626' : 'var(--color-text-tertiary)',
                cursor: 'pointer',
                transition: `background var(--motion-instant), color var(--motion-instant)`,
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <FaMicrophone size={14} />
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full"
            style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}
          >
            <FaPaperPlane size={12} aria-hidden="true" />
            {loading ? 'Thinking...' : 'Send Message'}
          </button>
        </form>
      </div>

      {chatResponse && (
        <div className="glass" style={{ padding: 'var(--space-7)' }}>
          <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-surface-raised)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🤖 CareerBot Response
          </p>
          <p style={{ fontSize: 'var(--font-size-md)', lineHeight: '1.7', color: 'var(--color-text-secondary)' }}>{chatResponse}</p>
        </div>
      )}
    </div>
  );
}
