"use client";
import React, { useState } from 'react';
import './register.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AllLandingHeader from '../Header';

const SignUpForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState(null); // State for success/error message
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, profileImage: file }));
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Reset message before submission

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: formDataObj,
      });

      if (response.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setMessageType('success');

        setTimeout(() => {
          router.push('/login');
        }, 2000); // Redirect after 2 seconds
      } else {
        setMessage('Failed to register. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred during registration.');
      setMessageType('error');
    }
  };

  return (
    <div>
      <AllLandingHeader />
      <div className="sign-up-form-container">
        <div className="sign-up-form-box">
          <h1 className="sign-up-header-title">Welcome to CUET Teacher's Association</h1>
          <h2 className="sign-up-header-subtitle">Complete Your Registration</h2>
          <form onSubmit={handleSubmit} className="sign-up-form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="sign-up-input-name"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your E-Mail"
              value={formData.email}
              onChange={handleChange}
              className="sign-up-input-email"
              required
            />
            <input
              type="text"
              name="department"
              placeholder="Your Department"
              value={formData.department}
              onChange={handleChange}
              className="sign-up-input-department"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="sign-up-input-phone"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Set Password"
              value={formData.password}
              onChange={handleChange}
              className="sign-up-input-password"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="sign-up-input-confirm-password"
              required
            />
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              placeholder="Profile Image"
              onChange={handleFileChange}
              className="sign-up-input-file"
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="sign-up-image-preview"
              />
            )}
            <button type="submit" className="sign-up-button-submit">
              Sign Up
            </button>

            {/* Display success or error message here */}
            {message && (
              <p className={`sign-up-message ${messageType}`}>
                {message}
              </p>
            )}
          </form>
          <div className="sign-up-login-link">
            <p>
              Already have an account?{' '}
              <Link href="/login" className="sign-up-login-button">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
