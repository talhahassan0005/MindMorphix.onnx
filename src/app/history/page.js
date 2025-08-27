'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HistoryManager from '@/components/HistoryManager';

export default function HistoryPage() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          // Redirect to login if not authenticated
          router.push('/');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  if (authLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-vh-100 bg-dark">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="text-center mb-4">
              <h1 className="text-primary mb-3">
                <i className="bi bi-clock-history me-2"></i>
                My Detection History
              </h1>
              <p className="text-light">
                View and manage your brain tumor detection results
              </p>
            </div>
            
            <HistoryManager user={user} isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </div>
  );
}
