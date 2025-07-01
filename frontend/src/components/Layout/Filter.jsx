// components/Filter.jsx
import React, { useEffect } from 'react';
import { FiX, FiDollarSign, FiClock, FiStar, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const Filter = ({ onClose, onSort }) => {
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains('filter-backdrop')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const sortOptions = [
    {
      id: 'priceLow',
      label: 'Price: Low to High',
      icon: FiDollarSign,
      color: 'blue',
      description: 'Sort by lowest price first'
    },
    {
      id: 'priceHigh',
      label: 'Price: High to Low',
      icon: FiDollarSign,
      color: 'blue',
      description: 'Sort by highest price first'
    },
    {
      id: 'durationLow',
      label: 'Duration: Short to Long',
      icon: FiClock,
      color: 'green',
      description: 'Sort by shortest duration first'
    },
    {
      id: 'durationHigh',
      label: 'Duration: Long to Short',
      icon: FiClock,
      color: 'green',
      description: 'Sort by longest duration first'
    },
    {
      id: 'ratingHigh',
      label: 'Rating: High to Low',
      icon: FiStar,
      color: 'yellow',
      description: 'Sort by highest rating first'
    },
    {
      id: 'ratingLow',
      label: 'Rating: Low to High',
      icon: FiStar,
      color: 'yellow',
      description: 'Sort by lowest rating first'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100'
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
  };

  const handleSort = (sortType) => {
    onSort(sortType);
    onClose();
  };

  return (
    <div className="filter-backdrop fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Sort Courses</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close filter"
          >
            <FiX className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Choose how you'd like to sort the courses
          </p>

          <div className="space-y-3">
            {sortOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSort(option.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${getColorClasses(option.color)}`}
                  aria-label={option.description}
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs opacity-75">{option.description}</div>
                  </div>
                  <div className="flex-shrink-0">
                    {option.id.includes('Low') ? (
                      <FiTrendingUp className="h-4 w-4" />
                    ) : (
                      <FiTrendingDown className="h-4 w-4" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
