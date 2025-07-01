import React from 'react';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const LoadMore = ({ sectionName }) => {
  if (!sectionName) return null;

  const getSectionPath = (name) => {
    const pathMap = {
      'Competitive Exams': '/competitive_exams',
      'Tech': '/tech',
      'Skills': '/skills',
      'School': '/school'
    };
    return pathMap[name] || `/${name.toLowerCase().replace(/\s+/g, '_')}`;
  };

  const sectionPath = getSectionPath(sectionName);

  return (
    <div className="flex justify-center sm:justify-end mt-8 mb-4 px-4">
      <Link
        to={sectionPath}
        className="group relative inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      >
        <span className="mr-2 sm:mr-3">Explore All {sectionName} Courses</span>
        <div className="flex items-center space-x-1">
          <FiArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
          <FiExternalLink className="h-3 w-3 sm:h-4 sm:w-4 opacity-75" />
        </div>
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-200"></div>
      </Link>
    </div>
  );
};

export default LoadMore;
