// components/HeaderActions.jsx
import React from 'react';
import { FiFilter, FiMessageCircle } from 'react-icons/fi';

const HeaderActions = ({ onFilterClick, onDiscussClick }) => (
  <div className="flex items-center gap-4 mb-4">
    <h2 className="text-3xl font-bold">Web Development</h2>

    <button
      onClick={onFilterClick}
      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
    >
      <FiFilter className="text-lg" />
      Filter
    </button>

    <button
      onClick={onDiscussClick}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
    >
      <FiMessageCircle className="text-lg" />
      Discuss
    </button>
  </div>
);

export default HeaderActions;
