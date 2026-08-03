import Chatbot from '../components/Chatbot';

const ChatAssistant = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-white mb-6">AI Career Assistant</h1>
      <Chatbot />
    </div>
  );
};

export default ChatAssistant;
