'use client';
import { useState, useEffect } from 'react';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log("Form data before submission:", formData);
    console.log("Form data validation:", {
      name: formData.name?.trim(),
      email: formData.email?.trim(),
      password: formData.password?.trim(),
      confirmPassword: formData.confirmPassword?.trim()
    });

    try {
      if (isLogin) {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        const data = await response.json();

        if (response.ok) {
          onClose();
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
          if (onLoginSuccess) {
            onLoginSuccess(data.user);
          }
        } else {
          setError(data.error || 'Login failed');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        // Validate that fields are not empty
        const trimmedName = formData.name?.trim();
        const trimmedEmail = formData.email?.trim();
        const trimmedPassword = formData.password?.trim();
        
        if (!trimmedName || !trimmedEmail || !trimmedPassword) {
          setError('All fields are required and cannot be empty');
          setLoading(false);
          return;
        }
        
        const requestBody = { name: trimmedName, email: trimmedEmail, password: trimmedPassword };
        console.log("Sending registration request:", requestBody);
        
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (response.ok) {
          // Auto-login after successful registration
          const loginResponse = await fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email: formData.email, password: formData.password }),
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok) {
            onClose();
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            if (onLoginSuccess) {
              onLoginSuccess(loginData.user);
            }
          } else {
            setError('Registration successful but login failed. Please try logging in.');
          }
        } else {
          setError(data.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show d-block" 
      onClick={handleBackdropClick}
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.9)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ 
        zIndex: 1000000,
        maxWidth: '500px',
        width: '90%',
        margin: '0 auto',
        position: 'relative'
      }}>
                 <div className="modal-content bg-dark-2 border-secondary shadow-lg" style={{ 
           background: 'linear-gradient(145deg, #0f0f0f, #1a1a1a)',
           border: '2px solid #3a7bd5',
           borderRadius: '15px',
           boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(58, 123, 213, 0.3)'
         }}>
                     <div className="modal-header border-secondary" style={{ 
             background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
             borderBottom: '2px solid #3a7bd5',
             borderRadius: '15px 15px 0 0',
             padding: '20px 25px'
           }}>
                         <h5 className="modal-title text-primary fw-bold" style={{ fontSize: '1.5rem', textShadow: '0 0 10px rgba(58, 123, 213, 0.5)' }}>
               <i className={`bi ${isLogin ? 'bi-box-arrow-in-right' : 'bi-person-plus'} me-2`}></i>
               {isLogin ? 'Welcome Back' : 'Create Account'}
             </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              style={{ fontSize: '1.2rem' }}
            ></button>
          </div>
                     <div className="modal-body" style={{ padding: '25px' }}>
                         {error && (
               <div className="alert" style={{
                 backgroundColor: 'rgba(220, 53, 69, 0.2)',
                 border: '2px solid #dc3545',
                 color: '#ff6b6b',
                 borderRadius: '10px',
                 padding: '15px 20px',
                 marginBottom: '25px',
                 boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
               }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                                     <label htmlFor="name" className="form-label text-light fw-semibold" style={{ fontSize: '1rem', color: '#ffffff', textShadow: '0 0 5px rgba(255,255,255,0.3)' }}>
                     <i className="bi bi-person me-2"></i>Full Name
                   </label>
                                     <input
                     type="text"
                     className="form-control"
                     style={{
                       backgroundColor: '#0f0f0f',
                       border: '2px solid #3a7bd5',
                       color: '#ffffff',
                       borderRadius: '10px',
                       padding: '15px 18px',
                       transition: 'all 0.3s ease',
                       fontSize: '1rem',
                       boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                     }}
                     id="name"
                     name="name"
                     value={formData.name}
                     onChange={handleInputChange}
                     required={!isLogin}
                     placeholder="Enter your full name"
                   />
                </div>
              )}

                             <div className="mb-3">
                 <label htmlFor="email" className="form-label text-light fw-semibold" style={{ fontSize: '1rem', color: '#ffffff', textShadow: '0 0 5px rgba(255,255,255,0.3)' }}>
                   <i className="bi bi-envelope me-2"></i>Email Address
                 </label>
                                 <input
                   type="email"
                   className="form-control"
                   style={{
                     backgroundColor: '#0f0f0f',
                     border: '2px solid #3a7bd5',
                     color: '#ffffff',
                     borderRadius: '10px',
                     padding: '15px 18px',
                     transition: 'all 0.3s ease',
                     fontSize: '1rem',
                     boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                   }}
                   id="email"
                   name="email"
                   value={formData.email}
                   onChange={handleInputChange}
                   required
                   placeholder="Enter your email address"
                 />
              </div>

                             <div className="mb-3">
                 <label htmlFor="password" className="form-label text-light fw-semibold" style={{ fontSize: '1rem', color: '#ffffff', textShadow: '0 0 5px rgba(255,255,255,0.3)' }}>
                   <i className="bi bi-lock me-2"></i>Password
                 </label>
                                 <input
                   type="password"
                   className="form-control"
                   style={{
                     backgroundColor: '#0f0f0f',
                     border: '2px solid #3a7bd5',
                     color: '#ffffff',
                     borderRadius: '10px',
                     padding: '15px 18px',
                     transition: 'all 0.3s ease',
                     fontSize: '1rem',
                     boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                   }}
                   id="password"
                   name="password"
                   value={formData.password}
                   onChange={handleInputChange}
                   required
                   placeholder="Enter your password"
                 />
              </div>

                             {!isLogin && (
                 <div className="mb-3">
                   <label htmlFor="confirmPassword" className="form-label text-light fw-semibold" style={{ fontSize: '1rem', color: '#ffffff', textShadow: '0 0 5px rgba(255,255,255,0.3)' }}>
                     <i className="bi bi-shield-check me-2"></i>Confirm Password
                   </label>
                                     <input
                     type="password"
                     className="form-control"
                     style={{
                       backgroundColor: '#0f0f0f',
                       border: '2px solid #3a7bd5',
                       color: '#ffffff',
                       borderRadius: '10px',
                       padding: '15px 18px',
                       transition: 'all 0.3s ease',
                       fontSize: '1rem',
                       boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                     }}
                     id="confirmPassword"
                     name="confirmPassword"
                     value={formData.confirmPassword}
                     onChange={handleInputChange}
                     required={!isLogin}
                     placeholder="Confirm your password"
                   />
                </div>
              )}

              <div className="d-grid gap-2 mt-4">
                                 <button
                   type="submit"
                   className="btn"
                   style={{
                     background: 'linear-gradient(145deg, #3a7bd5, #00d2ff)',
                     border: 'none',
                     borderRadius: '12px',
                     padding: '15px 25px',
                     fontSize: '18px',
                     fontWeight: '700',
                     color: '#ffffff',
                     transition: 'all 0.3s ease',
                     boxShadow: '0 6px 20px rgba(58, 123, 213, 0.4)',
                     textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                   }}
                   disabled={loading}
                 >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      {isLogin ? 'Logging in...' : 'Registering...'}
                    </>
                  ) : (
                    <>
                      <i className={`bi ${isLogin ? 'bi-box-arrow-in-right' : 'bi-person-plus'} me-2`}></i>
                      {isLogin ? 'Login' : 'Register'}
                    </>
                  )}
                </button>
              </div>
            </form>

                         <div className="text-center mt-4 pt-3" style={{ borderTop: '2px solid #3a7bd5' }}>
               <button
                 type="button"
                 className="btn btn-link"
                 style={{
                   color: '#3a7bd5',
                   textDecoration: 'none',
                   fontSize: '16px',
                   fontWeight: '600',
                   transition: 'all 0.3s ease',
                   textShadow: '0 0 5px rgba(58, 123, 213, 0.3)'
                 }}
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                }}
              >
                <i className={`bi ${isLogin ? 'bi-arrow-right-circle' : 'bi-arrow-left-circle'} me-2`}></i>
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

// Add CSS for input focus effects
const inputStyles = `
  .form-control:focus {
    background-color: #1a1a1a !important;
    border-color: #00d2ff !important;
    box-shadow: 0 0 0 0.3rem rgba(0, 210, 255, 0.3) !important;
    outline: none !important;
    transform: scale(1.02) !important;
  }
  
  .btn:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 8px 25px rgba(58, 123, 213, 0.5) !important;
  }
  
  .btn:active {
    transform: translateY(-1px) !important;
  }
  
  .modal-content {
    pointer-events: auto;
  }
  
  .modal-backdrop {
    pointer-events: auto;
  }
  
  /* Ensure modal is always on top */
  .modal {
    z-index: 999999 !important;
  }
  
  .modal-dialog {
    z-index: 1000000 !important;
  }
  
  .modal-content {
    z-index: 1000001 !important;
  }
  
  /* Enhanced visibility for form elements */
  .form-control::placeholder {
    color: #888 !important;
    opacity: 0.8 !important;
  }
  
  .form-label {
    margin-bottom: 8px !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = inputStyles;
  document.head.appendChild(style);
}
