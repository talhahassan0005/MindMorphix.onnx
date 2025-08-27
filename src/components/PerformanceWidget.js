'use client';
import { useEffect, useState } from 'react';

const PerformanceWidget = () => {
  const [metrics, setMetrics] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const resources = performance.getEntriesByType('resource');

      const performanceMetrics = {
        // Navigation timing
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
        loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
        firstByte: navigation?.responseStart - navigation?.requestStart,
        
        // Paint timing
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        
        // Resource loading
        totalResources: resources.length,
        slowResources: resources.filter(r => r.duration > 1000).length,
        
        // Memory usage (if available)
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        } : null,
        
        // Connection info
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : null
      };

      setMetrics(performanceMetrics);

      // Log performance issues
      if (performanceMetrics.domContentLoaded > 3000) {
        console.warn('Slow DOM Content Loaded:', performanceMetrics.domContentLoaded + 'ms');
      }
      
      if (performanceMetrics.loadComplete > 5000) {
        console.warn('Slow Page Load:', performanceMetrics.loadComplete + 'ms');
      }
      
      if (performanceMetrics.slowResources > 5) {
        console.warn('Too many slow resources:', performanceMetrics.slowResources);
      }
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}
        title="Performance Monitor"
      >
        📊
      </button>

      {/* Performance panel */}
      {isVisible && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 9999,
          maxWidth: '300px',
          minWidth: '250px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: '5px' }}>
            Performance Metrics
          </div>
          
          <div style={{ display: 'grid', gap: '4px' }}>
            <div>DOM Content Loaded: <strong>{metrics.domContentLoaded?.toFixed(2) || 'N/A'}ms</strong></div>
            <div>Page Load: <strong>{metrics.loadComplete?.toFixed(2) || 'N/A'}ms</strong></div>
            <div>First Paint: <strong>{metrics.firstPaint?.toFixed(2) || 'N/A'}ms</strong></div>
            <div>First Contentful Paint: <strong>{metrics.firstContentfulPaint?.toFixed(2) || 'N/A'}ms</strong></div>
            <div>Resources: <strong>{metrics.totalResources || 'N/A'} ({metrics.slowResources || 'N/A'} slow)</strong></div>
            
            {metrics.memory && (
              <div>Memory: <strong>{metrics.memory.used}MB / {metrics.memory.total}MB</strong></div>
            )}
            
            {metrics.connection && (
              <div>Connection: <strong>{metrics.connection.effectiveType} ({metrics.connection.downlink}Mbps)</strong></div>
            )}
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'none',
              border: 'none',
              color: '#ccc',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default PerformanceWidget;
