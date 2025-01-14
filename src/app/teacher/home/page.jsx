import React from "react";
import Link from "next/link";
import "../styles/homepage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <h1>CUET Teacher's Association</h1>
        <nav className="nav-links">
          <Link href="/profile">Profile</Link>
          <Link href="/register">Register</Link>
          <Link href="/logout">Log Out</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="menu">
          <div className="menu-item">
            <h3>Meeting Schedule</h3>
            <p>View upcoming meetings and events</p>
          </div>
          <div className="menu-item">
            <h3>Cast Your Vote</h3>
            <p>Participate in ongoing polls</p>
          </div>
          <div className="menu-item">
            <h3>Poll Results</h3>
            <p>View results of previous votes</p>
          </div>
        </div>

        <section className="archives">
          <h2>Recent Archives</h2>
          <div className="archive-item">
            <h3>
              3rd General Meeting of CUET Teachers Association held at CUET
            </h3>
            <p>
              চট্টগ্রাম প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (চুয়েট)-এর শিক্ষক সমিতির কার্যনির্বাহী পরিষদ (২০২৪-২০২৬)
              এর ৩য় সাধারণ সভা আজ ১৭ই সেপ্টেম্বর (মঙ্গলবার) ২০২৪ ঈঃ অনুষ্ঠিত হয়েছে
            </p>
            <p>September 17, 2024</p>
          </div>
          <div className="archive-item">
            <h3>57nd syndicate meeting</h3>
            <p>The 57nd syndicate meeting has been hosted by the VC DR. Rofiqul Alam</p>
            <p>August 27, 2024</p>
          </div>
          <Link href="/archives" className="view-all-link">
            View All
          </Link>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
