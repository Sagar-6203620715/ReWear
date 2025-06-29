// components/CourseList.jsx
import React from 'react';
import CourseCard from './CourseCard';

const CourseList = ({ courses, scrollRef, onSelect }) => (
  <div
    ref={scrollRef}
    className="container mx-auto overflow-x-scroll flex space-x-6 relative scroll-smooth"
  >
    {courses.map((course) => (
      <CourseCard key={course._id} course={course} onSelect={onSelect} />
    ))}
  </div>
);

export default CourseList;
