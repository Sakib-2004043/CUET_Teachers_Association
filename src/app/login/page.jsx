"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct router import for Next.js
import './login.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const router = useRouter(); // Initialize router instance

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Login successful');
        console.log('Response:', data);
        localStorage.setItem("token",data.token)
        router.push('/teacher'); // Redirect to the desired route
      } else {
        const errorData = await response.json();
        alert(`Failed to log in: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit">Log In</button>
        </form>
        <div className="register-link">
          <p>
            Don't Have Any Account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
