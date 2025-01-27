"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Import the Next.js router

import "./allLand.css"

export default function AllLandingPage() {
  const router = useRouter(); // Initialize the router instance

  return (
    <div className="all-land-container">
      {/* Hero Section */}
      <section className="all-land-hero">
        <div className="all-land-hero-content">
          <h1 className="all-land-title">Welcome to CUET Teachers' Association 🎓</h1>
          <p className="all-land-subtitle">
            Connecting teachers, fostering collaboration, and building a better future for education 🌟
          </p>
          <button
            className="all-land-explore-button"
            onClick={() => router.push("/about")}
          >
            Explore More 🌍
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section className="all-land-about">
        <h2 className="all-land-section-title">About Us 📚</h2>
        <p className="all-land-about-text">
          The CUET Teachers' Association is dedicated to fostering collaboration, 
          innovation, and excellence among educators at CUET. Together, we strive to 
          create a vibrant academic community that nurtures students and inspires growth 💡.
        </p>
        <button
          className="all-land-learn-more-button"
          onClick={() => router.push("/about")}
        >
          Learn More About Us 📖
        </button>
      </section>

      {/* Events Section */}
      <section className="all-land-events">
        <h2 className="all-land-section-title">Upcoming Events 📅</h2>
        <ul className="all-land-events-list">
          <li className="all-land-event-item">
            🗓️ <strong>Teacher Development Workshop:</strong> February 15, 2025
          </li>
          <li className="all-land-event-item">
            🏆 <strong>Annual CUET Awards:</strong> March 10, 2025
          </li>
          <li className="all-land-event-item">
            🎤 <strong>Educational Summit:</strong> April 25, 2025
          </li>
        </ul>
        <button
          className="all-land-events-button"
          onClick={() => router.push("/events")}
        >
          View All Events 🚀
        </button>
      </section>

      {/* Resources Section */}
      <section className="all-land-resources">
        <h2 className="all-land-section-title">Resources 🛠️</h2>
        <p className="all-land-resources-text">
          Access teaching materials, research articles, and exclusive tools 
          for CUET educators. Empower your teaching journey with our curated resources 🌱.
        </p>
        <button
          className="all-land-resources-button"
          onClick={() => router.push("/resources")}
        >
          Explore Resources 📂
        </button>
      </section>

      {/* Testimonials Section */}
      <section className="all-land-testimonials">
        <h2 className="all-land-section-title">What Our Members Say 💬</h2>
        <div className="all-land-testimonials-container">
          <div className="all-land-testimonial">
            <p className="all-land-testimonial-text">
              "Being a part of CUET Teachers' Association has transformed my teaching experience. 
              The support and resources are phenomenal! 💖"
            </p>
            <span className="all-land-testimonial-author">- Prof. Ahsanullah</span>
          </div>
          <div className="all-land-testimonial">
            <p className="all-land-testimonial-text">
              "The events and workshops are enriching and inspiring. 
              It feels great to be part of such a collaborative community 🌟."
            </p>
            <span className="all-land-testimonial-author">- Dr. Rahima Khatun</span>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="all-land-cta">
        <h2 className="all-land-cta-title">Join Us Today! 🌟</h2>
        <p className="all-land-cta-text">
          Be part of a thriving community of educators at CUET. Together, 
          we can make a difference in the academic and professional lives of our students 🚀.
        </p>
        <button
          className="all-land-cta-button"
          onClick={() => router.push("/register")}
        >
          Register Now ✍️
        </button>
      </section>
    </div>
  );
}
