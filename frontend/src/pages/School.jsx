// src/pages/Tech.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DomainCourses from '../components/Courses/DomainCourses';
import { fetchDomainsBySection } from '../redux/slices/domainsSlice';

const Tech = () => {
  const dispatch = useDispatch();
  const { domains, loading, error } = useSelector((state) => state.domains);

  useEffect(() => {
    dispatch(fetchDomainsBySection("Tech"));
  }, [dispatch]);

  return (
    <div>
      <h2 className="text-3xl font-bold ml-6 mt-10">Tech Courses</h2>
      {loading && <p className="text-center">Loading domains...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && domains.map((d) => (
        <DomainCourses key={d.name} domain={d.name} />
      ))}
    </div>
  );
};

export default Tech;
