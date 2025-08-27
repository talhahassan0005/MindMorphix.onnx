'use client';
import React, { useRef, useEffect } from "react";

const HeroSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Optimize video loading
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.muted = true;
    }
  }, []);

  return (
    <section className="position-relative text-white overflow-hidden" style={{ height: "600px" }}>
      {/* Optimized Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-0"
        style={{ willChange: 'transform' }}
      >
        <source src="/HeroSection.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optimized Overlay */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-1"
        style={{ willChange: 'opacity' }}
      />

      {/* Content Area */}
      <div className="container position-relative z-2 h-100 d-flex align-items-center">
        <div className="row">
          <div className="col-lg-8 text-center text-lg-start">
            <h1 className="display-4 fw-bold">
              Detect Brain Tumors <span className="text-success">Smarter</span> & Faster
            </h1>
            <p className="lead mt-3">
              Upload brain MRI scans and let <strong>MindMorphix</strong> assist you with accurate tumor detection using AI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
