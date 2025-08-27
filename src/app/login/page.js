"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
  
    const loginData = {
      email: email,
      password: password,
    };
  
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        console.log("Login successful:", data);
        
        // Save JWT token to localStorage after successful login
        localStorage.setItem('token', data.token);  // Assuming the token is returned in the response
  
        // Redirect to home page
        router.push('/');  // Redirect to the homepage
      } else {
        console.error("Login error:", data.message);  // This will log "Invalid credentials" or other messages
        setError(data.message);  // Set error message to show to user
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <div className="position-relative min-vh-100 m-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-0"
        style={{ zIndex: -1 }}
      >
        <source src="/HeroSection.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="container-fluid d-flex align-items-center justify-content-center position-relative z-index-1">
        <div
          className="p-4 shadow-lg text-white"
          style={{
            maxWidth: "400px",
            width: "100%",
            borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <h1 className="text-center mb-4 text-secondary">MindMorphix</h1>
          <h4 className="text-center mb-3 text-secondary">{isLoggedIn ? "Welcome Back!" : "Login"}</h4>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!isLoggedIn ? (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-secondary">Email address</label>
                <input
                  type="email"
                  className="form-control bg-transparent text-white border-secondary"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label text-secondary">Password</label>
                <input
                  type="password"
                  className="form-control bg-transparent text-white border-secondary"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-dark w-100 text-secondary fw-bold" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <p className="text-center mt-3 text-secondary">
               Don&apos;t have an account? <Link href="/singup" className="text-info">Register</Link>
              </p>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-white">You are logged in!</p>
              <button className="btn btn-secondary w-100 text-light fw-bold" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
