"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // Ensure you have this library installed
import "./profile.css";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [complaint, setComplaint] = useState(""); // State for complaint text
  const [previousComplaints, setPreviousComplaints] = useState([]); // State for previous complaints
  const router = useRouter();

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

            // Fetch previous complaints for the teacher
            await fetchPreviousComplaints(data.name);
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

  // Function to fetch previous complaints
  const fetchPreviousComplaints = async (teacherName) => {
    const token = localStorage.getItem("token");

    if (token && teacherName) {
      try {
        const response = await fetch('/api/complain', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ teacherName }),
        });

        if (response.ok) {
          const data = await response.json();
          setPreviousComplaints(data.complaints); 
          console.log(data)
        } else {
          console.error("Failed to fetch previous complaints:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching previous complaints:", error);
      }
    }
  };

  // Handle complaint submission
  const handleComplaintSubmit = async () => {
    const token = localStorage.getItem("token");

    if (token && complaint) {
      try {
        // Send POST request to submit complaint
        const response = await fetch('/api/complain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            teacherName: userDetails.name,
            complain: complaint,
          }),
        });

        if (response.ok) {
          alert("Complaint submitted successfully!");
          setComplaint(""); // Clear the input field after submission

          // Refresh the list of previous complaints
          await fetchPreviousComplaints(userDetails.name);
        } else {
          console.error("Failed to submit complaint:", response.statusText);
        }
      } catch (error) {
        console.error("Error submitting complaint:", error);
      }
    } else {
      alert("Please fill in the complaint text.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        <header className="profile-header">
          <h1>Teacher Profile</h1>
          <Link href="/" className="home-link">
            Go To Home
          </Link>
        </header>
        <div className="profile-image">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="profile-img"
            />
          ) : (
            <img
              src="/use.jpg" // Fallback image
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
            <button className="edit-button" onClick={() => router.push("/teacher/edit")}>Edit</button>
          </div>
        ) : (
          <p>Loading profile details...</p>
        )}
      </div>

      <div className="complaint-section">
        <div className="complaint-form">
          <textarea
            placeholder="Enter your complaint here..."
            className="complaint-input"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          ></textarea>
          <br />
          <button className="submit-button" onClick={handleComplaintSubmit}>Submit Complaint</button>
        </div>

        <div className="previous-complaints">
          <h2>Previous Complaints</h2>
          {previousComplaints.length > 0 ? (
            <ul>
              {previousComplaints.map((complain, index) => (
                <li key={index} className="complaint-item">
                  <p><strong>Date:</strong> {new Date(complain.date).toLocaleDateString()}</p>
                  <p><strong>Complaint:</strong> {complain.complain}</p>
                  {complain.reply && (
                    <p><strong>Reply:</strong> {complain.reply}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No previous complaints found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
