"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import "./layout.css";

export default function AdminLandSubLayout({ children }) {
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

        if (decodedData.role === "Member") {
          router.push("/teacher");
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
    <div className="admin-layout-container">
      {/* Admin Header */}
      <div className="admin-layout-header">
        <div className="admin-layout-header-left">
          <Image
            src="/CuetLogo.png"
            alt="CUET Teachers Association Logo"
            width={50}
            height={50}
            style={{height:"auto",width:"auto"}}
            className="admin-layout-cuet-logo"
            onClick={() => router.push("/")}
          />
        </div>
        <div className="admin-layout-header-center">
          <h1 className="admin-layout-header-title">🛠️ CUET Teachers Association Admin Dashboard</h1>
        </div>
        <div className="admin-layout-header-right">
          <Image
            src="/bell.png"
            alt="Notifications"
            width={50}
            height={50}
            className="admin-layout-bell-icon"
            onClick={() => router.push("/admin/complain")}
          />
          <button className="admin-layout-logout-btn" onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className="admin-layout-nav-container">
        <nav className="admin-layout-nav">
          <ul className="admin-layout-nav-list">
            <li className="admin-layout-nav-item">
              <Link href="/admin" className="admin-layout-nav-link">
                📊 Overview
              </Link>
            </li>
            <li className="admin-layout-nav-item">
              <Link href="/admin/allTeacher" className="admin-layout-nav-link">
                👥 Manage Teacher
              </Link>
            </li>
            <li className="admin-layout-nav-item">
              <Link href="/admin/poll" className="admin-layout-nav-link">
                📋 Manage Polls
              </Link>
            </li>
            <li className="admin-layout-nav-item">
              <Link href="/admin/complain" className="admin-layout-nav-link">
                📝 Complaints
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <main className="admin-layout-main">{children}</main>
    </div>
  );
}
