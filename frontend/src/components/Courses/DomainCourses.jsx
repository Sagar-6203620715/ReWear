import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import RatingForm from '../Layout/RatingForm';
import ChatDrawer from '../Layout/ChatDrawer';
import Filter from '../Layout/Filter';
import HeaderActions from './HeaderActions';
import ViewAllButton from './ViewAllButton';
import CourseList from './CourseList';

const DomainCourses = ({ domain }) => {
  const [courses, setCourses] = useState([]);
  const [sortedCourses, setSortedCourses] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!domain?._id) return;
      
      console.log('DomainCourses - Domain received:', domain);
      console.log('DomainCourses - Domain ID:', domain._id);
      console.log('DomainCourses - Domain Name:', domain.name);
      
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?domain=${domain._id}`);
        // Handle both old array format and new paginated format
        const coursesData = Array.isArray(res.data) ? res.data : res.data.courses || [];
        console.log('DomainCourses - Courses fetched:', coursesData.length);
        setCourses(coursesData);
        setSortedCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [domain?._id]);



  const handleSort = async (type) => {
    if (!domain?._id) return;
    
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?domain=${domain._id}&sortBy=${type}`);
      // Handle both old array format and new paginated format
      const coursesData = Array.isArray(res.data) ? res.data : res.data.courses || [];
      setSortedCourses(coursesData);
      setIsFilterOpen(false);
    } catch (error) {
      console.error("Failed to sort courses", error);
      setError('Failed to sort courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  if (!domain) {
    return (
      <section className="py-8 px-4 lg:px-0">
        <div className="container mx-auto text-center">
          <div className="text-gray-500">No domain information available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 lg:px-0">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <HeaderActions 
            domainName={domain.name} 
            onFilterClick={() => setIsFilterOpen(true)} 
            onDiscussClick={() => setIsDrawerOpen(true)} 
          />
        </div>

        {/* Course List with View All button */}
        <div className="relative">
          {!loading && courses.length > 0 && (
            <>
              {/* View All Button */}
              <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 z-40">
                <ViewAllButton
                  domainId={domain._id}
                  domainName={domain.name}
                  courseCount={courses.length}
                />
              </div>
            </>
          )}
          {/* Course List - Show only first 3 courses on home page */}
          {!loading && !error && courses.length > 0 && (
            <>
              <CourseList 
                courses={sortedCourses.slice(0, 3)} 
                scrollRef={scrollRef} 
                onSelect={setSelectedCourse} 
              />
              {/* Mobile View All Button */}
              <div className="sm:hidden mt-6 text-center">
                <ViewAllButton
                  domainId={domain._id}
                  domainName={domain.name}
                  courseCount={courses.length}
                />
              </div>
            </>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-600">Check back later for new courses in this domain.</p>
          </div>
        )}

        {/* Modals and Drawers */}
        {selectedCourse && (
          <RatingForm 
            course={selectedCourse} 
            onClose={() => setSelectedCourse(null)} 
          />
        )}
        
        {isFilterOpen && (
          <Filter 
            onClose={() => setIsFilterOpen(false)} 
            onSort={handleSort} 
          />
        )}
        
        <ChatDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          domainId={domain._id}
        />
      </div>
    </section>
  );
};

export default DomainCourses;
