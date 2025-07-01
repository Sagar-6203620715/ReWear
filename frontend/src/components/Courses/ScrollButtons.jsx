// components/ScrollButtons.jsx
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ScrollButtons = ({ canScrollLeft, canScrollRight, scrollLeft, scrollRight }) => {
  // Only render left or right button as needed
  if (!canScrollLeft && !canScrollRight) {
    return null;
  }

  return (
    <div className="flex flex-col items-center z-40 pointer-events-none">
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`p-2 sm:p-3 rounded-full border-2 shadow-lg transition-all duration-200 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-xl z-40 pointer-events-auto`}
          aria-label="Scroll left"
          style={{ marginBottom: '8px' }}
        >
          <FiChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`p-2 sm:p-3 rounded-full border-2 shadow-lg transition-all duration-200 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-xl z-40 pointer-events-auto`}
          aria-label="Scroll right"
          style={{ marginTop: '8px' }}
        >
          <FiChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}
    </div>
  );
};

export default ScrollButtons;
