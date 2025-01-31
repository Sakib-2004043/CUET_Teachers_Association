"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // Ensure you have this library installed
import "./profile.css";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/dateFormat";
import { setNotification } from "@/utils/notification";

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

          // Sort complaints by date in descending order
          const sortedComplaints = data.complaints.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
          );
          setPreviousComplaints(sortedComplaints);
        } 
        else {
          console.error("Failed to fetch previous complaints:", response.statusText);
        }
      } 
      catch (error) {
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
          setComplaint(""); 
          await setNotification("adminsNotification")

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
    <div className="teacher-profile-page">
      <div className="teacher-profile-main-container">
        <div className="teacher-profile-content">
          <header className="teacher-profile-header">
            <h1>Teacher Profile</h1>
            <Link href="/" className="teacher-profile-home-link">
              Go To Home
            </Link>
          </header>
          <div className="teacher-profile-image">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="teacher-profile-img"
              />
            ) : (
              <img
                src="/use.jpg" // Fallback image
                alt="Default Profile"
                className="teacher-profile-img"
              />
            )}
          </div>
          {userDetails ? (
            <div className="teacher-profile-details">
              <p><strong>Name:</strong> {userDetails.name}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Role:</strong> {userDetails.role}</p>
              <p><strong>Department:</strong> {userDetails.department}</p>
              <p><strong>Mobile:</strong> {userDetails.mobile}</p>
              <button
                className="teacher-profile-edit-button"
                onClick={() => router.push("/teacher/edit")}
              >
                Edit
              </button>
            </div>
          ) : (
            <p>Loading profile details...</p>
          )}
          <div className="teacher-profile-complaint-form">
            <textarea
              placeholder="Enter your complaint here..."
              className="teacher-profile-complaint-input"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            ></textarea>
            <br />
            <button
              className="teacher-profile-submit-button"
              onClick={handleComplaintSubmit}
            >
              Submit Complaint
            </button>
          </div>
        </div>
  
        <div className="teacher-profile-previous-complaints">
          <h2 className="teacher-profile-heading">Previous Complaints</h2>

          {previousComplaints.length > 0 ? (
            <ul className="teacher-profile-complaint-list">
              {previousComplaints.map((complain, index) => (
                <li key={index} className="teacher-profile-complaint-item">
                  {/* Complaint Card */}
                  <div className="teacher-profile-complaint-card">
                    <p className="teacher-profile-complaint-date">
                      <strong>Date:</strong> {formatDate(complain.date)}
                    </p>
                    <hr />
                    <p className="teacher-profile-complaint-text">
                      <strong>Complaint:</strong> {complain.complain}
                    </p>
                  </div>

                  {/* Reply Card (Only if available) */}
                  {complain.reply && (
                    <div className="teacher-profile-reply-card">
                      <p className="teacher-profile-reply-text">
                        <strong>Reply:</strong> {complain.reply}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="teacher-profile-no-complaints">No previous complaints found.</p>
          )}
        </div>

      </div>
    </div>
  );
  
};

export default Profile;
