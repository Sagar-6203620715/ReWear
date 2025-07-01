// components/CourseList.jsx
import React from 'react';
import CourseCard from './CourseCard';

const CourseList = ({ courses, scrollRef, onSelect }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-12">
          <p className="text-gray-500">No courses available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div
        ref={scrollRef}
        className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {courses.map((course) => (
          <div key={course._id} className="flex-shrink-0 w-80 sm:w-96">
            <CourseCard course={course} onSelect={onSelect} />
          </div>
        ))}
      </div>
      
      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CourseList;
