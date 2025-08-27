'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe, Home, Menu, X, LogIn, LogOut, User, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const navLinks = [
    { path: '/', name: 'Home', icon: <Home size={16} className="me-1" /> },
    { path: '/howitworks', name: 'How It Works' },
    { path: '/Detection', name: 'Detection' },
    { path: '/Support', name: 'Support' },
    { path: '/Blogs', name: 'Blog' },
    { path: '/AboutUs', name: 'About Us' },
  ];

  const navigateTo = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  // Check authentication status on mount
  useEffect(() => {
    // Only run on client side to prevent hydration issues
    if (typeof window !== 'undefined') {
      checkAuthStatus();
    }
  }, []);

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
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'DELETE',
        credentials: 'include'
      });
      setUser(null);
      setIsAuthenticated(false);
      setIsOpen(false);
      // Redirect to home page after logout
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      router.push('/');
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark px-4 py-2 sticky-top animate__animated animate__fadeInDown bg-dark`}>
      <div className="container-fluid">
        {/* Logo */}
        <div 
          className="navbar-brand d-flex align-items-center cursor-pointer"
          onClick={() => navigateTo('/')}
        >
          <span className="fw-bold text-success">Mind</span>
          <span className="ms-1">Morphix</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-4">
            {navLinks.map((link) => (
              <li key={link.path} className="nav-item">
                <button
                  onClick={() => navigateTo(link.path)}
                  className={`nav-link d-flex align-items-center ${
                    pathname === link.path ? 'active text-white' : 'text-gray-300'
                  }`}
                >
                  {link.icon && link.icon}
                  {link.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Right-side buttons */}
          <div className="d-flex align-items-center gap-3">
            {authLoading ? (
              <div className="spinner-border spinner-border-sm text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : isAuthenticated ? (
              <>
                <div className="d-flex align-items-center text-white me-3">
                  <User size={16} className="me-2" />
                  <span className="text-truncate" style={{ maxWidth: '120px' }}>
                    {user?.name || user?.email}
                  </span>
                </div>
                <button
                  onClick={() => navigateTo('/history')}
                  className="btn btn-outline-success d-flex align-items-center gap-1"
                >
                  <History size={16} />
                  <span>My History</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger d-flex align-items-center gap-1"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="btn btn-outline-light d-flex align-items-center gap-1"
              >
                <LogIn size={16} />
                <span>Login / Register</span>
              </button>
            )}
            <div className="d-flex align-items-center text-white">
              <Globe size={16} className="me-2" />
              <select 
                className="form-select form-select-sm bg-dark text-white border-light"
                aria-label="Language selector"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(user) => {
          setUser(user);
          setIsAuthenticated(true);
          setShowLoginModal(false);
        }}
      />
    </nav>
  );
};

export default Navbar;