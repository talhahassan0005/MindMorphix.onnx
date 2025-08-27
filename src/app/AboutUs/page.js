/* eslint-disable react/no-unescaped-entities */

'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Image from 'next/image';
const AboutUs = () => {
  return (
    <section className="py-5 bg-dark">
      <div className="container">

        <div className="row">
          <div className="col-md-6 mb-4">
            <h3 className="text-white">Meet Talha Hassan and the Team Behind the Innovation</h3>
            <p className="lead text-light">
              At <strong>MindMorphix</strong>, we are passionate about advancing healthcare through <strong>Deep Learning</strong> technologies. Led by <strong>Talha Hassan</strong>, our team is dedicated to leveraging cutting-edge AI to revolutionize medical fields and improve patient outcomes.
            </p>
          </div>

          <div className="col-md-6 mb-4">
          <Image
  src="/TeamPic.jpg"
  alt="Team"
  width={500}  // Add appropriate width in pixels
  height={300} // Add appropriate height in pixels
  className="img-fluid"
/>
</div>

        </div>

        <div className="row mt-5">
          <div className="col-md-12">
            <h4 className="text-white">Our Mission</h4>
            <p className="bg-dark text-light p-4 rounded">
              Our mission is simple: <strong>To use the power of Deep Learning to make healthcare smarter, faster, and more accessible</strong>. We believe that technology, when used correctly, can be a game-changer in medical diagnostics, treatment planning, and patient care.
            </p>
            <p className="bg-dark text-light p-4 rounded mt-3">
              By focusing on the latest advancements in <strong>Deep Learning</strong>, we aim to enhance the accuracy and speed of medical decisions, reduce human error, and empower healthcare professionals with advanced tools that help save lives. Our work is rooted in the belief that every patient deserves the best possible care, and we are committed to making that a reality with our innovations.
            </p>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12">
            <h4 className="text-white">What We Do</h4>
            <ul className="list-group">
              <li className=" bg-dark text-light">
                <strong>Medical Imaging</strong>: Using Deep Learning to analyze MRI, CT scans, and X-rays with greater accuracy, helping doctors detect conditions such as tumors, fractures, and more.
              </li>
              <li className=" bg-dark text-light">
                <strong>Disease Prediction</strong>: Our models can predict diseases like cancer, heart disease, and neurological disorders early, giving patients the best chance for successful treatment.
              </li>
              <li className=" bg-dark text-light">
                <strong>Clinical Decision Support</strong>: We are building systems that assist healthcare professionals in making faster and more accurate decisions, ultimately leading to better patient care.
              </li>
              <li className=" bg-dark text-light">
                <strong>Personalized Treatment Plans</strong>: By analyzing patient data, our AI helps create tailored treatment strategies, improving outcomes and patient satisfaction.
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12">
            <h4 className="text-white">Our Values</h4>
            <ul className="list-group">
              <li className=" bg-dark text-light">
                <strong>Innovation</strong>: We are constantly pushing the boundaries of what’s possible with Deep Learning in medicine.
              </li>
              <li className=" bg-dark text-light">
                <strong>Accuracy</strong>: In the medical field, precision is everything. Our AI solutions are designed with the utmost attention to detail to ensure that healthcare professionals can make informed decisions with confidence.
              </li>
              <li className=" bg-dark text-light">
                <strong>Compassion</strong>: We understand the importance of healthcare and the impact it has on people’s lives. Our goal is to empower professionals to provide better care, and patients to receive it faster and more effectively.
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12 text-center">
            <h4 className="text-white">Our Future</h4>
            <p className="bg-dark text-light p-4 rounded">
              The future is bright, and we’re excited about the possibilities. We are continually expanding our research to cover more areas of healthcare and working towards solutions that can make a tangible difference in people's lives. From early disease detection to more accurate diagnostic tools, we’re just getting started.
            </p>
            <p className="bg-dark text-light p-4 rounded mt-3">
              Join us on this journey toward smarter healthcare powered by Deep Learning.
            </p>
            <Image
              src="/promisepic.jpg"
              alt="Our Future"
              width={500}  // Add appropriate width in pixels
              height={300} // Add appropriate height in pixels
              className="img-fluid mt-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
