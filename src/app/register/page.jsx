"use client"
import React, { useState } from 'react';
import './register.css';
import { useRouter } from 'next/navigation';

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
        alert('Registration successful!');
        router.push('/login');
      } else {
        alert('Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h1 className="green-header">Welcome to CUET Teacher's Association</h1>
        <h2 className="green-header">Complete Your Registration</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your E-Mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="department"
            placeholder="Your Department"
            value={formData.department}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Set Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {imagePreview && <img src={imagePreview} alt="Profile Preview" className="image-preview" />}
          <button type="submit">Sign Up</button>
        </form>
        <div className="login-link">
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
