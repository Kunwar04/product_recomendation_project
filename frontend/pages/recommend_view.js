import React, { useState } from 'react';
import axios from 'axios';
import ChatDisplay from '../components/ChatDisplay.jsx'; // FIX: Added .jsx extension
import ChatInput from '../components/ChatInput.jsx';     // FIX: Added .jsx extension

const API_BASE_URL = 'http://localhost:8000'; 

const RecommendationPage = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([{ sender: 'ai', content: "Hello! Tell me what kind of furniture you're looking for (e.g., a leather sofa for a minimalist living room)." }]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userPrompt = prompt.trim();
    if (!userPrompt) return;

    // Add user message to the chat display
    setMessages((prev) => [...prev, { sender: 'user', content: userPrompt }]);
    setLoading(true);

    try {
      // API Call to FastAPI Backend
      const response = await axios.post(`${API_BASE_URL}/api/recommend`, { prompt: userPrompt });
      const recommendations = response.data;

      // Add AI response message (list of recommendations)
      setMessages((prev) => [...prev, { sender: 'ai', content: recommendations }]);
    } catch (error) {
      console.error('Recommendation Error:', error);
      setMessages((prev) => [...prev, { sender: 'ai', content: 'Sorry, the AI recommendation engine is currently unavailable. Please ensure the FastAPI backend is running.' }]);
    } finally {
      setPrompt('');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      <ChatDisplay messages={messages} loading={loading} />
      <ChatInput 
        prompt={prompt} 
        setPrompt={setPrompt} 
        handleSubmit={handleSubmit} 
        loading={loading} 
      />
    </div>
  );
};

export default RecommendationPage;
