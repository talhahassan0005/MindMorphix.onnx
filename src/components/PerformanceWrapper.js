'use client';
import dynamic from 'next/dynamic';

// Lazy load performance monitor
const PerformanceMonitor = dynamic(() => import('./PerformanceMonitor'), {
  ssr: false,
});

export default function PerformanceWrapper() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <PerformanceMonitor />;
}
