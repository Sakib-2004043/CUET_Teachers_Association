"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import "./login.css"
import AllLandingHeader from "../Header";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");  // New error state to store error messages
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Reset error before each submission

    try {
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("🎉 Login successful! Welcome back!");
        localStorage.setItem("token", data.token);
        
        if (data.role === "Member") {
          router.push("/teacher");
        } else {
          router.push("/admin");
        }
      } else {
        const errorData = await response.json();
        setError(`⚠️ Failed to log in: Invalid Credentials`);  // Set error message
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("❌ An error occurred. Please try again.");  // Set error message
    }
  };

  const navigateToRegister = () => {
    router.push("/register");
  };

  return (
    <>
      <AllLandingHeader />
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">🔑 Log In to Your Account</h1>
          <p className="login-message">Welcome back! 🌟 Let's get you signed in. 😊</p>
          <form onSubmit={handleSubmit}>
            <div className="login-input-field">
              <input
                type="email"
                name="email"
                placeholder="📧 Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="login-input-field">
              <input
                type="password"
                name="password"
                placeholder="🔒 Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="login-forgot-password">
              <button
                type="button"
                className="login-link-button"
              >
                Forgot Password? 🤔
              </button>
            </div>
            <button type="submit" className="login-submit-button">🚀 Log In</button>
          </form>

          {error && (
            <div className="login-error-message">
              <p>{error}</p>  {/* Render the error message here */}
            </div>
          )}

          <div className="login-register-link">
            <p className="login-register-text">
              Don’t have an account? 🤷‍♂️{" "}
              <button
                type="button"
                className="login-register-link-button"
                onClick={navigateToRegister}
              >
                Register Now! 📝
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(LoginForm), { ssr: false });
