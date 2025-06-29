import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

const LoadMore = ({x}) => {
  return (
    <div className="flex justify-end">
      <div className="bg-gradient-to-r from-gray-800 to-black text-white px-6 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer w-70 mr-[115px]">
        <a href={`/${x.toLowerCase().replace(/\s+/g, '_')}`} className="flex items-center gap-2 font-medium">
          <span>Explore All {x} Courses</span>
          <FiArrowRight className="text-2xl" />
        </a>
      </div>
    </div>
  );
};

export default LoadMore;
