import React from "react";
import Link from "next/link";
import "./layout.css";

export default function AdminLandSubLayout({ children }) {
  return (
    <div className="ad-land-sub-root-container">
      {/* Admin Header */}
      <header className="ad-land-sub-root-header">
        <h1 className="ad-land-sub-root-heading">🛠️ Admin Dashboard</h1>
        <nav className="ad-land-sub-root-nav">
          <ul className="ad-land-sub-root-nav-list">
            <li className="ad-land-sub-root-nav-item">
              <Link href="/admin/overview" className="ad-land-sub-root-nav-link">
                📊 Overview
              </Link>
            </li>
            <li className="ad-land-sub-root-nav-item">
              <Link href="/admin/users" className="ad-land-sub-root-nav-link">
                👥 Manage Users
              </Link>
            </li>
            <li className="ad-land-sub-root-nav-item">
              <Link href="/admin/poll" className="ad-land-sub-root-nav-link">
                📋 Manage Polls
              </Link>
            </li>
            <li className="ad-land-sub-root-nav-item">
              <Link href="/admin/settings" className="ad-land-sub-root-nav-link">
                ⚙️ Settings
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="ad-land-sub-root-main">{children}</main>
    </div>
  );
}
