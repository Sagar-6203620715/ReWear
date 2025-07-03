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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
      >
        {courses.map((course) => (
          <div key={course._id} className="flex justify-center">
            <CourseCard course={course} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
