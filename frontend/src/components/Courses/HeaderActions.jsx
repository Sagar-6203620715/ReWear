// components/HeaderActions.jsx
import React from 'react';
import { FiFilter, FiMessageCircle } from 'react-icons/fi';

const HeaderActions = ({ domainName, onFilterClick, onDiscussClick }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center sm:text-left">
      {domainName}
    </h2>

    <div className="flex items-center gap-2 sm:gap-3">
      <button
        onClick={onFilterClick}
        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
        aria-label="Filter courses"
      >
        <FiFilter className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">Filter</span>
      </button>

      <button
        onClick={onDiscussClick}
        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
        aria-label="Open discussion"
      >
        <FiMessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">Discuss</span>
      </button>
    </div>
  </div>
);

export default HeaderActions;
