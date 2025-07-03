import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const courseCache = new Map();

export const useOptimizedCourses = (domainId = null, filters = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const abortControllerRef = useRef(null);

  const cacheKey = JSON.stringify({ domainId, filters });

  const fetchCourses = useCallback(async (page = 1, append = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = courseCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION && page === 1) {
        setCourses(cached.data.courses);
        setPagination(cached.data.pagination);
        setHasMore(cached.data.pagination.hasNextPage);
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filters
      });

      if (domainId) {
        params.append('domain', domainId);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses?${params.toString()}`,
        {
          signal: abortControllerRef.current.signal,
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const { courses: newCourses, pagination: newPagination } = response.data;

      if (append) {
        setCourses(prev => [...prev, ...newCourses]);
      } else {
        setCourses(newCourses);
        // Cache first page
        courseCache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        });
      }

      setPagination(newPagination);
      setHasMore(newPagination.hasNextPage);

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [domainId, filters, cacheKey]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && pagination) {
      fetchCourses(pagination.currentPage + 1, true);
    }
  }, [loading, hasMore, pagination, fetchCourses]);

  const refresh = useCallback(() => {
    courseCache.delete(cacheKey);
    fetchCourses(1, false);
  }, [cacheKey, fetchCourses]);

  useEffect(() => {
    fetchCourses(1, false);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCourses]);

  // Clear cache when component unmounts
  useEffect(() => {
    return () => {
      // Keep cache for 5 minutes, then clear
      setTimeout(() => {
        courseCache.delete(cacheKey);
      }, CACHE_DURATION);
    };
  }, [cacheKey]);

  return {
    courses,
    loading,
    error,
    pagination,
    hasMore,
    loadMore,
    refresh
  };
}; 