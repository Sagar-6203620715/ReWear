// components/Courses/DomainCourses.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import RatingForm from '../Layout/RatingForm';
import ChatDrawer from '../Layout/ChatDrawer';
import Filter from '../Layout/Filter';
import HeaderActions from './HeaderActions';
import ScrollButtons from './ScrollButtons';
import CourseList from './CourseList';

const DomainCourses = ({ domain }) => {
  const [courses, setCourses] = useState([]);
  const [sortedCourses, setSortedCourses] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?domain=${domain}`);
        setCourses(res.data);
        setSortedCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [domain]);

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    updateScrollButtons();
    container.addEventListener('scroll', updateScrollButtons);
    return () => container.removeEventListener('scroll', updateScrollButtons);
  }, []);

  const handleSort = async (type) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?domain=${domain}&sortBy=${type}`);
      setSortedCourses(res.data);
      setIsFilterOpen(false);
    } catch (error) {
      console.error("Failed to sort courses", error);
    }
  };

  return (
    <section className="py-8 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-2xl font-bold mb-4">{domain}</h2>
        <HeaderActions onFilterClick={() => setIsFilterOpen(true)} onDiscussClick={() => setIsDrawerOpen(true)} />
        <ChatDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <ScrollButtons
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollLeft={() => scrollRef.current.scrollBy({ left: -500, behavior: 'smooth' })}
          scrollRight={() => scrollRef.current.scrollBy({ left: 500, behavior: 'smooth' })}
        />
      </div>

      <CourseList courses={sortedCourses} scrollRef={scrollRef} onSelect={setSelectedCourse} />
      {selectedCourse && <RatingForm course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
      {isFilterOpen && <Filter onClose={() => setIsFilterOpen(false)} onSort={handleSort} />}
    </section>
  );
};

export default DomainCourses;
