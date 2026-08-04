import Chatbot from '@/components/Chatbot';

export default function ChatAssistant() {
  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>AI Assistant</p>
          <h1 className="text-3xl font-bold text-white mb-2">Career Chatbot 🤖</h1>
          <p style={{ color: 'var(--text-muted)' }}>Ask anything about careers, skills, or job market trends.</p>
        </div>
        <Chatbot />
      </div>
    </div>
  );
}
