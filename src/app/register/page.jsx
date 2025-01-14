import React from 'react';
import './register.css';

const SignUpForm = () => {
  return (
    <div className="form-container">
      <div className="form-box">
        <h1 className="green-header">Welcome to CUET Teacher's Association</h1>
        <h2 className="green-header">Complete Your Registration</h2>
        <form>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Your E-Mail" required />
          <input type="text" placeholder="Your Department" required />
          <input type="tel" placeholder="Phone Number" required />
    
          <input type="password" placeholder="Set Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit">Sign Up</button>
        </form>
        <div className="login-link">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
