// pages/Home.jsx
import React, { useEffect } from 'react';
import Hero from '../components/Layout/Hero';
import ItemsGrid from '../components/Items/ItemsGrid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../redux/slices/itemsSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero />
      
      <div className="container mx-auto px-4">
        {items.length === 0 ? (
          <div className="py-12">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No items available</h2>
              <p className="text-gray-600">Check back later for new items!</p>
            </div>
          </div>
        ) : (
          <ItemsGrid 
            items={items} 
            title="Featured Items" 
            showViewAll={true}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
