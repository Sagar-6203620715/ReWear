import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiHeart, FiShare2 } from 'react-icons/fi';

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
          <div key={item._id || item.id} className="group relative">
            <Link to={`/item/${item._id || item.id}`} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group-hover:shadow-2xl">
                <div className="relative overflow-hidden">
                  <img
                    src={item.images && item.images.length > 0 ? item.images[0] : 'https://picsum.photos/seed/placeholder/400/500'}
                    alt={item.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <div className="flex space-x-3">
                        <button className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200 transform hover:scale-110">
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 transform hover:scale-110">
                          <FiHeart className="w-5 h-5" />
                        </button>
                        <button className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 transform hover:scale-110">
                          <FiShare2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                      item.condition === 'Like New' ? 'bg-green-100 text-green-800 group-hover:bg-green-200' :
                      item.condition === 'Excellent' ? 'bg-blue-100 text-blue-800 group-hover:bg-blue-200' :
                      item.condition === 'Good' ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200' :
                      'bg-gray-100 text-gray-800 group-hover:bg-gray-200'
                    }`}>
                      {item.condition}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                      Size: <span className="font-medium">{item.size}</span>
                    </span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                      By {item.user?.name || 'Unknown User'}
                    </span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                      {item.location || 'Unknown Location'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-semibold text-center group-hover:bg-green-700 transition-all duration-200 transform group-hover:scale-105 hover:shadow-md">
                      Swap Item
                    </div>
                    <div className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-semibold text-center group-hover:bg-gray-200 group-hover:text-gray-800 transition-all duration-200 transform group-hover:scale-105 hover:shadow-md">
                      Use Points
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsGrid; 