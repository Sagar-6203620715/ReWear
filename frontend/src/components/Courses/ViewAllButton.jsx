import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const ViewAllButton = ({ domainId, domainName, courseCount }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    // Validate domain ID
    if (!domainId || typeof domainId !== 'string') {
      console.error('ViewAllButton - Invalid domain ID:', domainId);
      alert('Invalid domain ID. Please try again.');
      return;
    }

    // Check if domain ID looks like a valid MongoDB ObjectId
    if (!domainId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('ViewAllButton - Domain ID is not a valid MongoDB ObjectId:', domainId);
      alert('Invalid domain ID format. Please try again.');
      return;
    }

    console.log('ViewAllButton - Domain ID:', domainId);
    console.log('ViewAllButton - Domain Name:', domainName);
    console.log('ViewAllButton - Generated URL:', `/domain/${domainId}/courses`);
    
    navigate(`/domain/${domainId}/courses`);
  };

  return (
    <div className="flex flex-col items-center z-40">
      <button
        onClick={handleViewAll}
        className="p-3 sm:p-4 rounded-full border-2 shadow-lg transition-all duration-200 bg-white border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:shadow-xl z-40 flex items-center space-x-2 group"
        aria-label={`View all ${courseCount} courses in ${domainName}`}
      >
        <span className="text-sm font-medium hidden sm:block">View All</span>
        <FiArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
      <div className="mt-2 text-xs text-gray-500 text-center hidden sm:block">
        {courseCount} courses
      </div>
    </div>
  );
};

export default ViewAllButton; 