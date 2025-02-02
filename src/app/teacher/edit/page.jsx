"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // Ensure you have this library installed
import "./edit.css";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Edit = () => {
  const [render, setRender] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [upImage, setUpImage] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatedDetails, setUpdatedDetails] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    mobile: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);

          const response = await fetch("/api/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email: decodedToken.email }),
          });

          if (response.ok) {
            const data = await response.json();
            setUserDetails(data);
            setUpdatedDetails({
              name: data.name,
              email: data.email,
              role: data.role,
              department: data.department,
              mobile: data.mobile,
            });

            if (data.profileImage) {
              const base64Image = Buffer.from(data.profileImage).toString("base64");
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
  }, [render]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "oldPassword") setOldPassword(value);
    else if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", updatedDetails.name);
        formData.append("department", updatedDetails.department);
        formData.append("mobile", updatedDetails.mobile);
        formData.append("role", updatedDetails.role);
        formData.append("oldPassword", oldPassword);
        formData.append("newPassword", newPassword);

        if (upImage) {
          formData.append("profileImage", upImage);
        }

        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const updatedData = await response.json();
          setUserDetails(updatedData);
          alert("Profile updated successfully!");
          router.push("/teacher/profile");
          setRender(!render);
        } else {
          console.error("Failed to update profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <div className="teacher-profile-page">
      <div className="teacher-profile-content">
        <header className="teacher-profile-header">
          <h1>Teacher Profile</h1>
          <Link href="/teacher" className="teacher-profile-home-link">
            Go To Home
          </Link>
        </header>

        <div className="teacher-profile-image-container">
          {/* <h2 className="teacher-profile-header2">Profile Image</h2> */}
          <div className="teacher-profile-prev-image-div">
            <h3>Profile Image</h3>
            {profileImage ? (
              <>
                
                <img src={profileImage} alt="User Profile" className="teacher-profile-img" />
                <p>Current Profile Image</p>
              </>
            ) : (
              <p className="teacher-profile-prev-image-div">No Profile Image</p>
            )}
          </div>
          <div className="teacher-profile-new-image-div">
            <h3>Preview New Image</h3>
            {newImage ? (
              <img src={newImage} alt="New Profile" className="teacher-profile-img" />
            ) : (
              <p>No Image Selected</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="teacher-profile-file-input"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="teacher-profile-form">
          <section className="teacher-profile-details">
            <label>
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={updatedDetails.name}
                onChange={handleInputChange}
                className="teacher-profile-input"
              />
            </label>
            <p>
              <strong>Email:</strong> {updatedDetails.email}
            </p>
            <label>
              <strong>Role:</strong>
              <input
                type="text"
                name="role"
                value="Member"
                onChange={handleInputChange}
                className="teacher-profile-input"
                disabled
              />
            </label>
            <label>
              <strong>Department:</strong>
              <input
                type="text"
                name="department"
                value={updatedDetails.department}
                onChange={handleInputChange}
                className="teacher-profile-input"
              />
            </label>
            <label>
              <strong>Mobile:</strong>
              <input
                type="text"
                name="mobile"
                value={updatedDetails.mobile}
                onChange={handleInputChange}
                className="teacher-profile-input"
              />
            </label>
          </section>

          <section className="teacher-profile-password-change">
            <h3>Change Password</h3>
            <label>
              <strong>Old Password:</strong>
              <input
                type="password"
                name="oldPassword"
                value={oldPassword}
                onChange={handlePasswordChange}
                className="teacher-profile-input"
              />
            </label>
            <label>
              <strong>New Password:</strong>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                className="teacher-profile-input"
              />
            </label>
            <label>
              <strong>Confirm New Password:</strong>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handlePasswordChange}
                className="teacher-profile-input"
              />
            </label>
          </section>

          <button type="submit" className="teacher-profile-submit-button">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Edit), { ssr: false });
