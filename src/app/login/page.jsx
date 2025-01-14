import React from 'react';
import './login.css';

const LoginForm = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>LogIn</h1>
        <form>
          <div className="input-field">
            <input type="text" placeholder="USER NAME" required />
          </div>
          <div className="input-field">
            <input type="password" placeholder="PASSWORD" required />
          </div>
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit">LOG IN</button>
        </form>
        <div className="register-link">
          <p>Don't Have Any Account? <a href="#">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
