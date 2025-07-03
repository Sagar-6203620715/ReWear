import React, { useEffect, useState } from 'react';

const PerformanceMonitor = ({ coursesCount, renderTime }) => {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    renderCount: 0,
    averageRenderTime: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      if ('memory' in performance) {
        const memory = performance.memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
          renderCount: prev.renderCount + 1,
          averageRenderTime: prev.averageRenderTime > 0 
            ? (prev.averageRenderTime + renderTime) / 2 
            : renderTime
        }));
      }
    };

    updateMetrics();
  }, [renderTime]);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div>Courses: {coursesCount}</div>
        <div>Memory: {metrics.memoryUsage}MB</div>
        <div>Render Time: {renderTime.toFixed(2)}ms</div>
        <div>Avg Render: {metrics.averageRenderTime.toFixed(2)}ms</div>
        <div>Renders: {metrics.renderCount}</div>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 