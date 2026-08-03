import { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setChatMessage(transcript);
    };

    recognition.start();
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/chat',
        { message: chatMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatResponse(res.data.reply);
    } catch (err) {
      console.error(err);
      alert('Chatbot error. Make sure the server is running.');
    }
  };

  return (
    <div className="mt-8 sm:mt-10 bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 p-4 sm:p-6 rounded-2xl shadow-inner max-w-4xl w-full">
  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center sm:text-left">
    Ask CareerBot 🧠
  </h2>

  <form onSubmit={handleChatSubmit} className="flex flex-col space-y-4">
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        placeholder="Ask anything about your career..."
        className="flex-1 px-4 py-2 text-white rounded-lg bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 outline-none"
      />
      <button
        type="button"
        onClick={handleVoiceInput}
        className="flex-shrink-0 bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
      >
        🎙️ {isListening ? 'Listening...' : 'Speak'}
      </button>
    </div>

    <button
      type="submit"
      className="w-full bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all"
    >
      send 👉
    </button>
  </form>

  {chatResponse && (
    <div className="mt-4 p-4 bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 border border-indigo-200 rounded-xl text-gray-800">
      <strong>CareerBot:</strong> {chatResponse}
    </div>
  )}
</div>

  );
};

export default Chatbot;
