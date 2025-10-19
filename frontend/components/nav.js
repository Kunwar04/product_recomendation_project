import React from 'react';

const Nav = ({ currentPage, setCurrentPage }) => (
  <header className="bg-white shadow-md p-4 sticky top-0 z-10">
    <div className="container mx-auto flex justify-between items-center max-w-7xl">
      <h1 className="text-2xl font-extrabold text-indigo-700">AI Furniture Hub</h1>
      <nav className="space-x-4">
        <button
          onClick={() => setCurrentPage('recommendation')}
          className={`px-4 py-2 rounded-full font-medium transition duration-300 ${
            currentPage === 'recommendation' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-600 hover:bg-indigo-50'
          }`}
        >
          Recommendation Chat
        </button>
        <button
          onClick={() => setCurrentPage('analytics')}
          className={`px-4 py-2 rounded-full font-medium transition duration-300 ${
            currentPage === 'analytics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-600 hover:bg-indigo-50'
          }`}
        >
          Data Analytics
        </button>
      </nav>
    </div>
  </header>
);

export default Nav;