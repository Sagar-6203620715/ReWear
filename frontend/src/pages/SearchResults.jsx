import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CourseList from '../components/Courses/CourseList';
import RatingForm from '../components/Layout/RatingForm';
import ScrollButtons from '../components/Courses/ScrollButtons';
import HeaderActions from '../components/Courses/HeaderActions';
import ChatDrawer from '../components/Layout/ChatDrawer';
import Filter from '../components/Layout/Filter';

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get('query');

  const [searchedCourse, setSearchedCourse] = useState(null);
  const [domainCourses, setDomainCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?search=${query}`);
        const course = courseRes.data[0];

        if (course) {
          setSearchedCourse(course);
          const domainRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?domain=${course.domain._id}`);
          const otherCourses = domainRes.data.filter(c => c._id !== course._id);
          setDomainCourses([course, ...otherCourses]);
        } else {
          const domainRes = await axios.get(`/api/domains/search?query=${query}`);
          const matchedDomain = domainRes.data[0];

          if (matchedDomain) {
            const coursesInDomain = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?domain=${matchedDomain._id}`);
            setDomainCourses(coursesInDomain.data);
            setSearchedCourse({ domain: matchedDomain });
          } else {
            setDomainCourses([]);
          }
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query) fetchData();
  }, [query]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    updateScrollButtons();
    container.addEventListener('scroll', updateScrollButtons);
    return () => container.removeEventListener('scroll', updateScrollButtons);
  }, [domainCourses]);

  const handleSort = async (type) => {
    try {
      const domainId = searchedCourse?.domain?._id;
      if (!domainId) return;

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses?domain=${domainId}&sortBy=${type}`
      );

      const sorted = res.data;

      if (searchedCourse?.name) {
        const others = sorted.filter(c => c._id !== searchedCourse._id);
        setDomainCourses([searchedCourse, ...others]);
      } else {
        setDomainCourses(sorted);
      }

      setIsFilterOpen(false);
    } catch (error) {
      console.error("Sorting error:", error);
    }
  };

  // Add a function to refresh course data
  const refreshCourseData = async (courseId) => {
    try {
      const courseRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses/${courseId}`);
      const updatedCourse = courseRes.data;
      setSearchedCourse(updatedCourse);
      setDomainCourses((prev) => {
        return prev.map(c => c._id === updatedCourse._id ? updatedCourse : c);
      });
    } catch (error) {
      console.error('Failed to refresh course data', error);
    }
  };

  return (
    <section className="py-8 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-2xl font-bold mb-2">
          Search results for "{query}"
        </h2>
        <br></br>

        {!searchedCourse?.name && searchedCourse?.domain?.name && (
          <p className="text-gray-500 text-sm">
            No course matched. Showing courses in domain "{searchedCourse.domain.name}"
          </p>
        )}

        {domainCourses.length > 0 && (
          <HeaderActions
            domainName={searchedCourse?.domain?.name || 'Search'}
            onDiscussClick={() => setIsDrawerOpen(true)}
            onFilterClick={() => setIsFilterOpen(true)}
          />
        )}

        <ChatDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          domainId={searchedCourse?.domain?._id}
        />

        <ScrollButtons
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollLeft={() => scrollRef.current.scrollBy({ left: -500, behavior: 'smooth' })}
          scrollRight={() => scrollRef.current.scrollBy({ left: 500, behavior: 'smooth' })}
        />
      </div>

      {domainCourses.length === 0 ? (
        <p className="text-center text-gray-600">No courses found.</p>
      ) : (
        <CourseList
          courses={domainCourses}
          scrollRef={scrollRef}
          onSelect={setSelectedCourse}
        />
      )}

      {selectedCourse && (
        <RatingForm
          course={selectedCourse}
          onClose={() => {
            setSelectedCourse(null);
            refreshCourseData(selectedCourse._id);
          }}
        />
      )}

      {isFilterOpen && (
        <Filter onClose={() => setIsFilterOpen(false)} onSort={handleSort} />
      )}
    </section>
  );
};

export default SearchResults;
