import React from "react";
import Link from "next/link";
import "./profile.css";

const Profile = () => {
  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Teacher Profile</h1>
        <Link href="/" className="home-link">
          Go To Home
        </Link>
      </header>
      <div className="profile-content">
        <div className="profile-image">
          <img
            src="/use.jpg"
            alt="Profile"
            className="profile-img"
          />
        </div>
        <div className="profile-details">
          <p><strong>Name:</strong> Jhon Doe</p>
          <p><strong>Email:</strong> john.doe@gmail.com</p>
          <p><strong>Department:</strong> Computer Science and Engineering</p>
          <p>
            <strong>Teaching Subjects:</strong> Software Engineering, Software
            Development
          </p>
          <p><strong>Years of Experience:</strong> 20 years</p>
          <p>
            <strong>Research Interests:</strong> Artificial Intelligence,
            Machine Learning, Networking
          </p>
        </div>
      </div>
      <div className="complaint-form">
        <h2>Make a Complaint</h2>
        <textarea
          placeholder="Enter your complaint here..."
          className="complaint-input"
        ></textarea>
        <button className="submit-button">Submit Complaint</button>
      </div>
    </div>
  );
};

export default Profile;
