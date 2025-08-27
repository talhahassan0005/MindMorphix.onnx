'use client';
import { useEffect, useState } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({});

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

    // Monitor for performance issues
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation' && entry.loadEventEnd - entry.loadEventStart > 5000) {
          console.warn('Slow navigation detected:', entry);
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => {
      window.removeEventListener('load', measurePerformance);
      observer.disconnect();
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="performance-monitor">
      <details>
        <summary>Performance Metrics</summary>
        <div className="metrics-grid">
          <div className="metric">
            <strong>DOM Content Loaded:</strong> {metrics.domContentLoaded?.toFixed(2)}ms
          </div>
          <div className="metric">
            <strong>Page Load:</strong> {metrics.loadComplete?.toFixed(2)}ms
          </div>
          <div className="metric">
            <strong>First Paint:</strong> {metrics.firstPaint?.toFixed(2)}ms
          </div>
          <div className="metric">
            <strong>First Contentful Paint:</strong> {metrics.firstContentfulPaint?.toFixed(2)}ms
          </div>
          <div className="metric">
            <strong>Resources:</strong> {metrics.totalResources} ({metrics.slowResources} slow)
          </div>
          {metrics.memory && (
            <div className="metric">
              <strong>Memory:</strong> {metrics.memory.used}MB / {metrics.memory.total}MB
            </div>
          )}
          {metrics.connection && (
            <div className="metric">
              <strong>Connection:</strong> {metrics.connection.effectiveType} ({metrics.connection.downlink}Mbps)
            </div>
          )}
        </div>
      </details>

      <style jsx>{`
        .performance-monitor {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 10px;
          border-radius: 8px;
          font-size: 12px;
          z-index: 9999;
          max-width: 300px;
        }
        
        .performance-monitor summary {
          cursor: pointer;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .metrics-grid {
          display: grid;
          gap: 4px;
        }
        
        .metric {
          padding: 2px 0;
        }
      `}</style>
    </div>
  );
};

export default PerformanceMonitor;
