'use client';

import React from 'react';
import { FaBrain, FaRocket, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  return (
    <section className="bg-dark text-white py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose MindMorphix?</h2>
          <p className="lead text-light">
            AI-powered brain tumor detection that’s fast, secure, and reliable.
          </p>
        </div>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-secondary bg-opacity-10 rounded-4 shadow-sm h-100"
            >
              <FaBrain size={50} className="text-success mb-3" />
              <h5 className="fw-semibold">AI Precision</h5>
              <p className="text-light">
                Leverages cutting-edge deep learning to detect even the smallest anomalies.
              </p>
            </motion.div>
          </div>
          <div className="col-md-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-secondary bg-opacity-10 rounded-4 shadow-sm h-100"
            >
              <FaRocket size={50} className="text-primary mb-3" />
              <h5 className="fw-semibold">Real-Time Results</h5>
              <p className="text-light">
                Get diagnostic insights in seconds with our optimized cloud processing.
              </p>
            </motion.div>
          </div>
          <div className="col-md-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-secondary bg-opacity-10 rounded-4 shadow-sm h-100"
            >
              <FaShieldAlt size={50} className="text-danger mb-3" />
              <h5 className="fw-semibold">Data Privacy</h5>
              <p className="text-light">
                Your scans are secure — encrypted and never stored without your permission.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
