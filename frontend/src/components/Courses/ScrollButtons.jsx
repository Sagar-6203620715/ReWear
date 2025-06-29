// components/ScrollButtons.jsx
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ScrollButtons = ({ canScrollLeft, canScrollRight, scrollLeft, scrollRight }) => (
  <div className="absolute right-0 bottom-[-30px] flex space-x-2">
    <button
      onClick={scrollLeft}
      disabled={!canScrollLeft}
      className={`p-2 rounded border bg-white text-black ${
        !canScrollLeft ? 'opacity-40 cursor-not-allowed' : ''
      }`}
    >
      <FiChevronLeft className="text-2xl" />
    </button>
    <button
      onClick={scrollRight}
      disabled={!canScrollRight}
      className={`p-2 rounded border bg-white text-black ${
        !canScrollRight ? 'opacity-40 cursor-not-allowed' : ''
      }`}
    >
      <FiChevronRight className="text-2xl" />
    </button>
  </div>
);

export default ScrollButtons;
