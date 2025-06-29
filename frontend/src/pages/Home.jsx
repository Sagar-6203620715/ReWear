// pages/Home.jsx
import React from 'react';
import Hero from '../components/Layout/Hero';
import DomainCourses from '../components/Courses/DomainCourses';
import LoadMore from '../components/Common/LoadMore';

const sections = {
  "Competitive Exams": ["JEE", "NEET", "UPSC"],
  "Tech": ["Web Dev", "DSA", "AI ML"],
  "Skills": ["Communication", "Writing", "Public Speaking"],
  "School": ["Class 10", "Class 12"],
};

const Home = () => {
  return (
    <div>
      <Hero />
      {Object.entries(sections).map(([section, domains]) => (
        <div key={section}>
          <h2 className="text-3xl font-bold ml-6 mt-10">{section}</h2>
          {domains.map(domain => (
            <DomainCourses key={domain} domain={domain} />
          ))}
          <LoadMore x={section} />
        </div>
      ))}
    </div>
  );
};

export default Home;
