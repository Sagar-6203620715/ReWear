import React from 'react';
import { Link } from 'react-router-dom';

const ItemsGrid = ({ items, title, showViewAll = false }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {showViewAll && (
          <Link
            to="/browse-items"
            className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
          >
            View All →
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link key={item._id || item.id} to={`/item/${item._id || item.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 block">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.condition === 'Like New' ? 'bg-green-100 text-green-800' :
                  item.condition === 'Excellent' ? 'bg-blue-100 text-blue-800' :
                  item.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.condition}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">
                  Size: <span className="font-medium">{item.size}</span>
                </span>
                <span className="text-sm text-gray-500">
                  {item.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  By {item.user?.name || 'Unknown User'}
                </span>
                <span className="text-sm text-gray-500">
                  {item.location || 'Unknown Location'}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <div className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-semibold text-center">
                  Make Offer
                </div>
                <div className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-semibold text-center">
                  View Details
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ItemsGrid; 