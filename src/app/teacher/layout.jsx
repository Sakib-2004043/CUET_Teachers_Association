"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import "./layout.css";

export default function teacherLandSubLayout({ children }) {
  const router = useRouter();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    router.push("/login"); // Redirect to login page
  };

  const validateToken = async () => {
    const isValid = await checkToken(router);
    if (!isValid) {
      console.log("Redirected due to invalid token");
      return;
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedData = jwtDecode(token);
        console.log("Role:", decodedData.role);

        if (decodedData.role === "Admin") {
          router.push("/admin");
        } 
        else if (decodedData.role !== "Member" && decodedData.role !== "Admin") {
          router.push("/");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  useEffect(() => {
    validateToken();
  }, [router]);

  return (
    <div className="teacher-layout-container">
      {/* teacher Header */}
      <div className="teacher-layout-header">
        <div className="teacher-layout-header-left">
          <Image
            src="/CuetLogo.png"
            alt="CUET Teachers Association Logo"
            width={50}
            height={50}
            style={{height:"auto",width:"auto"}}
            className="teacher-layout-cuet-logo"
            onClick={() => router.push("/teacher")}
          />
        </div>
        <div className="teacher-layout-header-center">
          <h1 className="teacher-layout-header-title">🛠️ CUET Teachers Association Teacher Dashboard</h1>
        </div>
        <div className="teacher-layout-header-right">
          <Image
            src="/bell.png"
            alt="Notifications"
            width={50}
            height={50}
            className="teacher-layout-bell-icon"
            onClick={() => router.push("/teacher/poll")}
          />
          <button className="teacher-layout-logout-btn" onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className="teacher-layout-nav-container">
        <nav className="teacher-layout-nav">
          <ul className="teacher-layout-nav-list">
            <li className="teacher-layout-nav-item">
              <Link href="/teacher" className="teacher-layout-nav-link">
                📊 Overview
              </Link>
            </li>
            <li className="teacher-layout-nav-item">
              <Link href="/teacher/profile" className="teacher-layout-nav-link">
                👨🏻‍💼 Profile
              </Link>
            </li>
            <li className="teacher-layout-nav-item">
              <Link href="/teacher/poll" className="teacher-layout-nav-link">
                🗳️ Vote
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <main className="teacher-layout-main">{children}</main>
    </div>
  );
}
