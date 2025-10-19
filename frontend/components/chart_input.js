import React from 'react';

const ChatInput = ({ prompt, setPrompt, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
    <div className="flex max-w-4xl mx-auto space-x-3">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the furniture you want..."
        className="flex-grow border border-gray-300 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
        disabled={loading || !prompt.trim()}
      >
        Ask AI
      </button>
    </div>
  </form>
);

export default ChatInput;
