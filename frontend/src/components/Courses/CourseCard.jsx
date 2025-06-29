import React from 'react';
import { FaStar } from 'react-icons/fa';

const formatDuration = ({ years, months }) => {
  const y = years ? `${years} year${years > 1 ? 's' : ''}` : '';
  const m = months ? `${months} month${months > 1 ? 's' : ''}` : '';
  return [y, m].filter(Boolean).join(' ');
};

const CourseCard = ({ course, onSelect }) => {
  console.log("CourseCard rendered:", course.name, course.duration, typeof course.duration);


  return (
    <div className="min-w-[450px] max-w-[450px] relative">
      <a href={course.affiliate_link} target="_blank" rel="noopener noreferrer">
        <img
          src={course.image.url}
          alt={course.image.altText || course.name}
          className="w-full h-[300px] object-cover rounded-lg"
        />
      </a>

      <div
        className="absolute top-2 right-2 flex space-x-1 bg-white/70 px-2 py-1 rounded-md z-10 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation(); // Prevent link trigger
          onSelect(course);
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-sm ${
              star <= course.rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
        <h4 className="font-medium">{course.name}</h4>
        <p className="text-sm mt-1 text-white">Duration: {formatDuration(course.duration)}</p>

        <p className="text-sm mt-1 text-gray-200">Price: ₹{course.price}</p>
      </div>
    </div>
  );
};

export default CourseCard;
