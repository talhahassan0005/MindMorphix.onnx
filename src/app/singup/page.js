"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const { name, email, password, confirmPassword } = formData;

    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Registration failed");
      }

      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="position-relative min-vh-100 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        style={{ zIndex: -1 }}
      >
        <source src="/HeroSection.mp4" type="video/mp4" />
      </video>

      <div className="container d-flex align-items-center justify-content-center position-relative z-1 min-vh-100">
        <div className="p-4 shadow-lg text-white" style={{ maxWidth: "400px", width: "100%", borderRadius: "10px", backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}>
          <h2 className="text-center mb-4 text-secondary">MindMorphix</h2>
          <h4 className="text-center mb-4 text-secondary">Register</h4>

          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleRegister}>
            {['name', 'email', 'password', 'confirmPassword'].map((field, idx) => (
              <div className="mb-3" key={idx}>
                <label htmlFor={field} className="form-label text-secondary">
                  {field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                  className="form-control bg-transparent text-secondary border-secondary"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  minLength={field.includes('password') ? 8 : undefined}
                />
              </div>
            ))}

            <button type="submit" className="btn btn-dark w-100 text-secondary py-2" disabled={isSubmitting}>
              {isSubmitting ? <><span className="spinner-border spinner-border-sm me-2"></span> Registering...</> : 'Register'}
            </button>

            <p className="text-center mt-3 text-secondary">
              Already have an account? <Link href="/login" className="text-info">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}