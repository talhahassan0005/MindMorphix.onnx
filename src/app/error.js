'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
          <h2 className="text-light mb-3 mt-3">Something went wrong!</h2>
          <p className="text-muted mb-4">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
        </div>
        
        <div className="d-flex justify-content-center gap-3">
          <button 
            onClick={reset}
            className="btn btn-primary"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Try Again
          </button>
          <Link href="/" className="btn btn-outline-primary">
            <i className="bi bi-house me-2"></i>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
