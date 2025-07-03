import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CourseList from '../components/Courses/CourseList';
import RatingForm from '../components/Layout/RatingForm';
import ViewAllButton from '../components/Courses/ViewAllButton';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, try to find courses that match the search query
        const courseRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?search=${query}`);
        const courses = courseRes.data;

        if (courses.length > 0) {
          // If courses found, show the first matching course and others from same domain
          const course = courses[0];
          setSearchedCourse(course);
          const domainRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?domain=${course.domain._id}`);
          const otherCourses = domainRes.data.filter(c => c._id !== course._id);
          setDomainCourses([course, ...otherCourses]);
        } else {
          // If no courses found, search for domains
          const domainRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/domains/search?query=${query}`);
          const matchedDomains = domainRes.data;

          if (matchedDomains.length > 0) {
            // If domains found, show all courses from the first matching domain
            const matchedDomain = matchedDomains[0];
            const coursesInDomain = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?domain=${matchedDomain._id}`);
            setDomainCourses(coursesInDomain.data);
            setSearchedCourse({ domain: matchedDomain });
          } else {
            // No courses or domains found
            setDomainCourses([]);
            setSearchedCourse(null);
          }
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setDomainCourses([]);
        setSearchedCourse(null);
      }
    };

    if (query) fetchData();
  }, [query]);



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
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              No exact course match found for "{query}"
            </p>
            <p className="text-blue-600 font-medium">
              Showing all courses in domain: "{searchedCourse.domain.name}"
            </p>
          </div>
        )}

        {searchedCourse?.name && (
          <p className="text-gray-600 text-sm mb-4">
            Found course: "{searchedCourse.name}" in domain "{searchedCourse.domain.name}"
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

        {domainCourses.length > 0 && searchedCourse?.domain?._id && (
          <ViewAllButton
            domainId={searchedCourse.domain._id}
            domainName={searchedCourse.domain.name}
            courseCount={domainCourses.length}
          />
        )}
      </div>

      {domainCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg mb-2">No results found for "{query}"</p>
          <p className="text-gray-500 text-sm">Try searching for a different course, domain, or skill</p>
        </div>
      ) : (
        <>
          <CourseList
            courses={domainCourses}
            scrollRef={scrollRef}
            onSelect={setSelectedCourse}
          />
          {/* Mobile View All Button */}
          {searchedCourse?.domain?._id && (
            <div className="sm:hidden mt-6 text-center">
              <ViewAllButton
                domainId={searchedCourse.domain._id}
                domainName={searchedCourse.domain.name}
                courseCount={domainCourses.length}
              />
            </div>
          )}
        </>
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
