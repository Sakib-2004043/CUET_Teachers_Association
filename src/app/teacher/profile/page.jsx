"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // Ensure you have this library installed
import "./profile.css";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Decode the token
          const decodedToken = jwtDecode(token);

          // Send POST request to fetch user details
          const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email: decodedToken.email }),
          });

          if (response.ok) {
            const data = await response.json();
            setUserDetails(data);

            // Handle profile image if present
            if (data.profileImage) {
              const base64Image = Buffer.from(data.profileImage).toString('base64');
              setProfileImage(`data:image/jpeg;base64,${base64Image}`);
            }
          } else {
            console.error("Failed to fetch profile data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        console.error("No token found in localStorage.");
      }
    };

    fetchProfile();
  }, []);

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
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="profile-img"
            />
          ) : (
            <img
              src="/default-profile.jpg" // Fallback image
              alt="Default Profile"
              className="profile-img"
            />
          )}
        </div>
        {userDetails ? (
          <div className="profile-details">
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Role:</strong> {userDetails.role}</p>
            <p><strong>Department:</strong> {userDetails.department}</p>
            <p><strong>Mobile:</strong> {userDetails.mobile}</p>
          </div>
        ) : (
          <p>Loading profile details...</p>
        )}
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
