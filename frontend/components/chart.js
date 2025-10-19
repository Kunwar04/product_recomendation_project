import React from 'react';
import RecommendationCard from './RecommendationCard';

// Component to render the User's message
const UserMessage = ({ content }) => <p className="font-medium">{content}</p>;

// Component to render the AI response, including recommendations
const AiMessage = ({ content }) => {
  if (Array.isArray(content)) {
    return (
      <div className='ai-response'>
        <p className="text-lg font-semibold mb-3 text-indigo-700">Top 5 Recommendations for You:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((rec, i) => (
            <RecommendationCard key={i} product={rec} />
          ))}
        </div>
      </div>
    );
  }
  return <p>{content}</p>; // Fallback message (e.g., error/greeting)
};

const ChatDisplay = ({ messages, loading }) => {
    return (
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-4xl p-4 rounded-xl shadow-md transition-all ${
                  msg.sender === 'user'
                    ? 'bg-indigo-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                }`}
              >
                {msg.sender === 'user' ? (
                  <UserMessage content={msg.content} />
                ) : (
                  <AiMessage content={msg.content} />
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-xl shadow-md rounded-tl-none animate-pulse">
                <span className="text-gray-500">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>
    );
};

export default ChatDisplay;
