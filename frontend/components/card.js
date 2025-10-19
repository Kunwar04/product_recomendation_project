import React from 'react';

const RecommendationCard = ({ product }) => {
  // Logic to safely extract the first image URL and clean it up
  const imageUrl = product.image_url ? product.image_url.split(',')[0].replace(/\[|\]|'/g, '').trim() : '';

  // Safely parse price, handling potential strings and nulls
  const parsedPrice = product.price ? parseFloat(String(product.price).replace('$', '').replace(',', '').trim()) : null;
  const displayPrice = parsedPrice !== null && !isNaN(parsedPrice) ? `$${parsedPrice.toFixed(2)}` : 'N/A';
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 transition duration-300 hover:shadow-xl flex flex-col h-full border border-gray-100">
      <div className="w-full h-40 overflow-hidden rounded-lg mb-4">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null; // prevents looping
            e.target.src = `https://placehold.co/400x300/6366f1/ffffff?text=Image+Unavailable`;
          }}
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1 leading-tight">{product.title.substring(0, 50)}{product.title.length > 50 ? '...' : ''}</h3>
      <p className="text-2xl font-bold text-indigo-600 mb-3">{displayPrice}</p>
      
      {/* GenAI Generated Description */}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <p className="text-sm italic text-gray-600">
          <span className="font-bold text-indigo-700">AI Says:</span> "{product.creative_description}"
        </p>
      </div>
    </div>
  );
};

export default RecommendationCard;
