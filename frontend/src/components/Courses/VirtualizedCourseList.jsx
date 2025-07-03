import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import CourseCard from './CourseCard';

const VirtualizedCourseList = ({ courses, onCourseSelect }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [containerRef, setContainerRef] = useState(null);

  // Calculate grid dimensions
  const COLUMN_COUNT = 4; // Adjust based on screen size
  const ROW_HEIGHT = 400; // Height of each course card
  const COLUMN_WIDTH = dimensions.width / COLUMN_COUNT;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef) {
        const rect = containerRef.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [containerRef]);

  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const courseIndex = rowIndex * COLUMN_COUNT + columnIndex;
    const course = courses[courseIndex];

    if (!course) return null;

    return (
      <div style={style}>
        <div className="p-2">
          <CourseCard 
            course={course} 
            onSelect={onCourseSelect}
          />
        </div>
      </div>
    );
  }, [courses, onCourseSelect, COLUMN_COUNT]);

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses available</h3>
        <p className="text-gray-600">Check back later for new courses.</p>
      </div>
    );
  }

  const rowCount = Math.ceil(courses.length / COLUMN_COUNT);

  return (
    <div 
      ref={setContainerRef}
      className="w-full h-full"
      style={{ height: '80vh' }}
    >
      {dimensions.width > 0 && (
        <Grid
          columnCount={COLUMN_COUNT}
          columnWidth={COLUMN_WIDTH}
          height={dimensions.height}
          rowCount={rowCount}
          rowHeight={ROW_HEIGHT}
          width={dimensions.width}
        >
          {Cell}
        </Grid>
      )}
    </div>
  );
};

export default VirtualizedCourseList; 