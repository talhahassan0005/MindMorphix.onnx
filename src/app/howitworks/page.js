'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { FaUpload, FaBrain, FaEye, FaHistory, FaShieldAlt, FaChartLine, FaUserShield } from 'react-icons/fa';
import Image from 'next/image';

const HowItWorks = () => {
  return (
    <section className="bg-dark text-white py-5">
      <div className="container">
        <h2 className="text-center display-4 fw-bold mb-5">
          How <span className="text-primary">MindMorphix</span> Works
        </h2>

        {/* Step 1 */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1470&q=80"
              alt="Upload MRI"
              width={500}  // Add appropriate width in pixels
              height={300} // Add appropriate height in pixels

              className="img-fluid rounded shadow"
             
 // Add appropriate height in pixels
            />
          </div>
          <div className="col-lg-6">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary text-white rounded-circle p-3 me-3">
                <FaUpload />
              </div>
              <h3 className="h4 fw-bold mb-0">Upload Your MRI Scan</h3>
            </div>
            <p>Upload MRI scans in DICOM, JPG, PNG, and more. Secure and easy drag-and-drop interface.</p>
            <ul className="list-unstyled">
              <li>✓ Supports standard medical formats</li>
              <li>✓ Secure cloud storage</li>
              <li>✓ Simple drag-and-drop uploads</li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="row align-items-center mb-5 flex-lg-row-reverse">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <Image
              src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1470&q=80"
              alt="AI Analysis"
              width={500}  // Add appropriate width in pixels
              height={300} // Add appropriate height in pixels
              className="img-fluid rounded shadow"
              

            />
          </div>
          <div className="col-lg-6">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-secondary text-white rounded-circle p-3 me-3">
                <FaBrain />
              </div>
              <h3 className="h4 fw-bold mb-0">AI-Powered Tumor Detection</h3>
            </div>
            <p>Advanced AI detects anomalies, evaluates sequences, and maps tumor regions.</p>
            <ul className="list-unstyled">
              <li>• 3D volumetric analysis</li>
              <li>• Multi-sequence evaluation</li>
              <li>• Tumor size and location</li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <Image
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1470&q=80"
              alt="View Results"
              width={500}  // Add appropriate width in pixels
              height={300} // Add appropriate height in pixels
              className="img-fluid rounded shadow"
              
             
            />
          </div>
          <div className="col-lg-6">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success text-white rounded-circle p-3 me-3">
                <FaEye />
              </div>
              <h3 className="h4 fw-bold mb-0">Comprehensive Results</h3>
            </div>
            <p>View annotated results, explanations, and measurements in a detailed report.</p>
            <ul className="list-unstyled">
              <li>• Tumor probability score</li>
              <li>• Size and comparison to past scans</li>
              <li>• 3D visual tools and measurement</li>
            </ul>
          </div>
        </div>

        {/* Step 4 */}
        <div className="row align-items-center mb-5 flex-lg-row-reverse">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1470&q=80"
              alt="History"
              width={500}  // Add appropriate width in pixels
              height={300} // Add appropriate height in pixels
              className="img-fluid rounded shadow"
              


            />
          </div>
          <div className="col-lg-6">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-warning text-dark rounded-circle p-3 me-3">
                <FaHistory />
              </div>
              <h3 className="h4 fw-bold mb-0">Track Your Health History</h3>
            </div>
            <p>Monitor changes, access previous scans, and securely share results.</p>
            <ul className="list-unstyled">
              <li><FaChartLine className="me-2" /> Progress tracking</li>
              <li><FaUserShield className="me-2" /> Secure sharing</li>
              <li><FaShieldAlt className="me-2" /> HIPAA compliant</li>
            </ul>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-5">
          <h3 className="h3 fw-bold mb-4">Why Choose <span className="text-primary">MindMorphix</span>?</h3>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="bg-secondary text-white p-4 rounded shadow-sm h-100">
                <FaBrain className="mb-3 fs-2" />
                <h5>Cutting-Edge AI</h5>
                <p>Trained on thousands of cases for accurate detection.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="bg-primary text-white p-4 rounded shadow-sm h-100">
                <FaShieldAlt className="mb-3 fs-2" />
                <h5>Privacy First</h5>
                <p>End-to-end encrypted medical data handling.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="bg-success text-white p-4 rounded shadow-sm h-100">
                <FaChartLine className="mb-3 fs-2" />
                <h5>Longitudinal Tracking</h5>
                <p>Monitor changes over time in your brain health.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h4 className="mb-3">Ready to Get Started?</h4>
          <p className="mb-4">Join thousands who trust MindMorphix for early detection and peace of mind.</p>
          <button className="btn btn-lg btn-primary px-4">
            Upload Your MRI Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
