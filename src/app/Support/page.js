'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';

const Support = () => {
  // State to track the clicked question
  const [activeQuestion, setActiveQuestion] = useState(null);

  // Function to toggle visibility of the answer
  const toggleAnswer = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section className=" bg-dark text-white">
      <div className="container">
        <h2 className="text-center text-primary ">Support Center</h2>

        {/* FAQ Section */}
        <div className=" bg-dark">
          <h3 className="text-secondary">Frequently Asked Questions (FAQ)</h3>
          <div className=" bg-color">
            <div className=" bg-dark text-white">
              <a href="#" onClick={() => toggleAnswer(1)} className="text-white">
                How do I upload my MRI scan?
              </a>
              {activeQuestion === 1 && (
                <div className=" text-light">
                  <p>To upload your MRI scan, go to the upload section and choose your file.</p>
                </div>
              )}
            </div>
            <div className=" bg-dark text-white">
              <a href="#" onClick={() => toggleAnswer(2)} className="text-white">
                What formats are supported for upload?
              </a>
              {activeQuestion === 2 && (
                <div className=" text-light">
                  <p>We support DICOM, JPG, and PNG formats for MRI scans.</p>
                </div>
              )}
            </div>
            <div className=" bg-dark text-white">
              <a href="#" onClick={() => toggleAnswer(3)} className="text-white">
                How do I interpret my scan results?
              </a>
              {activeQuestion === 3 && (
                <div className=" text-light">
                  <p>Our system provides an analysis report for your MRI scan based on AI technology.</p>
                </div>
              )}
            </div>
            <div className=" bg-dark text-white">
              <a href="#" onClick={() => toggleAnswer(4)} className="text-white">
                What should I do if I have trouble uploading my file?
              </a>
              {activeQuestion === 4 && (
                <div className=" text-light">
                  <p>If you face issues, check the file format and ensure your internet connection is stable.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className=" bg-dark">
          <h3 className="text-secondary">Contact Us</h3>
          <p>Email us at: <a href="mailto:talhafast0005@gmail.com" className="text-info">talhafast0005@gmail.com</a></p>
          <p>Phone: +92 3021419651</p>
          <p>Live Chat: Available from 9:00 AM to 6:00 PM (M-F)</p>
        </div>

        {/* Troubleshooting Section */}
        <div className=" bg-dark">
          <h3 className="text-secondary">Troubleshooting</h3>
          <p>If you&apos;re facing issues, check out the following solutions:</p>
          <ul className="">
            <li className=" bg-dark text-white">
              <strong>Problem</strong>: &quot;Unable to upload MRI scan.&quot;

              <br />
              <strong>Solution</strong>: Check the file format (supported formats: DICOM, JPG, PNG).
            </li>
            <li className=" bg-dark text-white">
              
              <strong>Problem</strong>: &quot;Page not loading.&quot;

              <br />
              <strong>Solution</strong>: &quot; Ensure you&apos;re using an updated version of your browser.&quot;

            </li>
          </ul>
        </div>

        {/* Submit a Request Section */}
        <div className=" bg-dark">
          <h3 className="text-secondary">Submit a Request</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-solid rounded-0 shadow-none"
                id="name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control bg-dark text-white border-solid rounded-0 shadow-none"
                id="email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="issue" className="form-label">Issue Description</label>
              <textarea
                className="form-control bg-dark text-white border-solid rounded-0 shadow-none"
                id="issue"
                rows="4"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 border-0 rounded-3 hover-custom"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Support;
