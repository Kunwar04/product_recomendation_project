

import React, { useState, useEffect } from 'react';
// Import Components
import Nav from './components/nav.jsx'; // FIX: Added .jsx extension
// Import Pages
import RecommendationPage from './pages/RecommendationPage.jsx'; // FIX: Added .jsx extension
import AnalyticsPage from './pages/AnalyticsPage.jsx';           // FIX: Added .jsx extension


const App = () => {
  // State handles navigation/routing between the two main views
  const [currentPage, setCurrentPage] = useState('recommendation'); 

  // Load Tailwind CSS CDN on mount (Required for single-file environment)
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto max-w-7xl">
        {currentPage === 'recommendation' && <RecommendationPage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
      </main>
    </div>
  );
};

export default App;
