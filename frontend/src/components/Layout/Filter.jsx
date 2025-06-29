// components/Filter.jsx
import React from 'react';

const Filter = ({ onClose, onSort }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
          onClick={onClose}
          aria-label="Close Filter"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sort Courses</h2>

        <div className="space-y-3">
          <button
            onClick={() => onSort('priceLow')}
            className="w-full px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition"
          >
            💸 Price: Low to High
          </button>
          <button
            onClick={() => onSort('priceHigh')}
            className="w-full px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition"
          >
            💰 Price: High to Low
          </button>
          <button
            onClick={() => onSort('durationLow')}
            className="w-full px-4 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition"
          >
            ⏱️ Duration: Low to High
          </button>
          <button
            onClick={() => onSort('durationHigh')}
            className="w-full px-4 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition"
          >
            ⏳ Duration: High to Low
          </button>
          <button
            onClick={() => onSort('ratingHigh')}
            className="w-full px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
          >
            ⭐ Rating: High to Low
          </button>
          <button
            onClick={() => onSort('ratingLow')}
            className="w-full px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
          >
            🌟 Rating: Low to High
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
