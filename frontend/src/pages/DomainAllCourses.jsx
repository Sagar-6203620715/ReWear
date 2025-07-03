import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../components/Courses/CourseCard';
import RatingForm from '../components/Layout/RatingForm';
import ChatDrawer from '../components/Layout/ChatDrawer';
import Filter from '../components/Layout/Filter';
import HeaderActions from '../components/Courses/HeaderActions';
import { FiArrowLeft } from 'react-icons/fi';

const DomainAllCourses = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  
  const [domain, setDomain] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sortedCourses, setSortedCourses] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDomainAndCourses = async () => {
      if (!domainId) return;
      
      console.log('Fetching domain and courses for domainId:', domainId);
      console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch domain details
        console.log('Fetching domain details...');
        const domainRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/domains/${domainId}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('Domain response:', domainRes.data);
        setDomain(domainRes.data);
        
        // Fetch all courses in the domain
        console.log('Fetching courses...');
        const coursesRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?domain=${domainId}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('Courses response:', coursesRes.data);
        // Handle both old array format and new paginated format
        const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.courses || [];
        setCourses(coursesData);
        setSortedCourses(coursesData);
      } catch (error) {
        console.error("Error fetching domain and courses:", error);
        console.error("Error response:", error.response);
        if (error.response?.status === 404) {
          setError('Domain not found. The domain may have been removed or the link is invalid.');
        } else {
          setError('Failed to load domain and courses. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDomainAndCourses();
  }, [domainId]);

  const handleSort = async (type) => {
    if (!domainId) return;
    
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?domain=${domainId}&sortBy=${type}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
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

  const refreshCourseData = async (courseId) => {
    try {
      const courseRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses/${courseId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const updatedCourse = courseRes.data;
      setCourses((prev) => {
        return prev.map(c => c._id === updatedCourse._id ? updatedCourse : c);
      });
      setSortedCourses((prev) => {
        return prev.map(c => c._id === updatedCourse._id ? updatedCourse : c);
      });
    } catch (error) {
      console.error('Failed to refresh course data', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Go back"
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {domain?.name || 'Domain Courses'}
                </h1>
                <p className="text-gray-600">
                  {courses.length} course{courses.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            
            {courses.length > 0 && (
              <HeaderActions 
                domainName={domain?.name || 'Domain'} 
                onFilterClick={() => setIsFilterOpen(true)} 
                onDiscussClick={() => setIsDrawerOpen(true)} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-600">Check back later for new courses in this domain.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {sortedCourses.map((course) => (
              <div key={course._id} className="w-80 sm:w-96 flex-shrink-0">
                <CourseCard
                  course={course}
                  onSelect={setSelectedCourse}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals and Drawers */}
      {selectedCourse && (
        <RatingForm 
          course={selectedCourse} 
          onClose={() => {
            setSelectedCourse(null);
            refreshCourseData(selectedCourse._id);
          }} 
        />
      )}

      <ChatDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        domainId={domainId}
      />

      {isFilterOpen && (
        <Filter onClose={() => setIsFilterOpen(false)} onSort={handleSort} />
      )}
    </div>
  );
};

export default DomainAllCourses; 