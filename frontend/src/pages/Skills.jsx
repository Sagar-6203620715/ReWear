// pages/Tech.jsx
import React from 'react';
import DomainCourses from '../components/Courses/DomainCourses';

const techDomains = ["Web Dev", "DSA", "AI ML"];

const Tech = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold ml-6 mt-10">Tech Courses</h2>
      {techDomains.map(domain => (
        <DomainCourses key={domain} domain={domain} />
      ))}
    </div>
  );
};

export default Tech;
