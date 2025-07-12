import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, setFilters, clearFilters } from '../redux/slices/itemsSlice';
import { FiEye, FiHeart, FiShare2 } from 'react-icons/fi';

const BrowseItems = () => {
  const dispatch = useDispatch();
  const { items, loading, error, filters: reduxFilters } = useSelector(state => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Filter items based on current filters
  const filteredItems = items.filter(item => {
    if (reduxFilters.category && item.category !== reduxFilters.category) return false;
    if (reduxFilters.size && item.size !== reduxFilters.size) return false;
    if (reduxFilters.condition && item.condition !== reduxFilters.condition) return false;
    return true;
  });

  // Sort items based on current sort
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (reduxFilters.sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'condition':
        const conditionOrder = { 'Like New': 1, 'Excellent': 2, 'Good': 3, 'Fair': 4 };
        return conditionOrder[a.condition] - conditionOrder[b.condition];
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Items</h1>
          <p className="text-xl text-gray-600">
            Discover amazing clothing items from our community
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={reduxFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Dresses">Dresses</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Sweaters">Sweaters</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <select
                value={reduxFilters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Sizes</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="One Size">One Size</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={reduxFilters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Conditions</option>
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={reduxFilters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="condition">Best Condition</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedItems.length} of {items.length} items
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <div key={item._id} className="group relative">
              <Link to={`/item/${item._id}`} className="block">
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

        {/* Empty State */}
        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new items.</p>
            <button
              onClick={handleClearFilters}
              className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {sortedItems.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-md font-semibold hover:bg-green-50 transition-colors duration-200">
              Load More Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseItems; 