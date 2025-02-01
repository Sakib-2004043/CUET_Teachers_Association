"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./poll.css";
import { formatDate } from "@/utils/dateFormat";

export default function TeacherPoll() {
  const [polls, setPolls] = useState([]); // State to store all polls
  const [filteredPolls, setFilteredPolls] = useState([]); // State to store filtered polls
  const [filter, setFilter] = useState("open"); // Filter state (all, open, closed)
  const [teacherName, setTeacherName] = useState(""); // State to store teacher's name

  // Fetch all polls from the API
  const fetchPolls = async () => {
    try {
      const response = await fetch("/api/poll");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Sort polls by date in descending order (latest first)
      const sortedPolls = data.polls.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));

      setPolls(sortedPolls); // Update the polls state
      setFilteredPolls(sortedPolls); // Initially show all polls
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  // Decode the JWT token to get teacher's name
  const decodeToken = () => {

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTeacherName(decoded.name || "Unknown Teacher");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  useEffect(() => {
    fetchPolls(); // Fetch polls on component mount
    decodeToken(); // Decode token on component mount
  }, []);

  // Handle voting
  const handleVoteClick = (pollId, vote) => async () => {
    if (!teacherName) {
      console.error("Teacher's name not found.");
      return;
    }

    try {
      const response = await fetch(`/api/poll`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pollId,
          vote,
          teacherName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();

      // Refetch polls to update the UI
      fetchPolls();
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === "all") {
      setFilteredPolls(polls);
    } else {
      setFilteredPolls(polls.filter((poll) => poll.status === status));
    }
  };

  const getCountdown = (deadline) => {
    const targetTime = new Date(deadline).getTime();
    const currentTime = new Date().getTime();
    const timeLeft = targetTime - currentTime;
  
    if (timeLeft <= 0) return "00:00:00:00";
  
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
    return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFilteredPolls((prevPolls) =>
        prevPolls.map((poll) => ({
          ...poll,
          countdown: getCountdown(poll.lastDate),
        }))
      );
    }, 1000);
  
    return () => clearInterval(interval);
  }, [polls]);
  
  

  return (
    <div className="teacher-poll-page-container">
      <h1 className="teacher-poll-page-title">🗳️ Ongoing Polls</h1>
      <p className="teacher-poll-subtitle">
        Participate in the decision-making process. Cast your vote wisely!
      </p>

      <div className="teacher-poll-nav-button-container">
        <button
          className={`teacher-poll-nav-allPoll-button ${filter === "all" ? "active" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          All Polls
        </button>
        <button
          className={`teacher-poll-nav-openPoll-button ${filter === "open" ? "active" : ""}`}
          onClick={() => handleFilterChange("open")}
        >
          Open Polls
        </button>
        <button
          className={`teacher-poll-nav-closedPoll-button ${filter === "closed" ? "active" : ""}`}
          onClick={() => handleFilterChange("closed")}
        >
          Closed Polls
        </button>
      </div>

      {filteredPolls.length > 0 ? (
        <ul className="teacher-poll-list">
          {filteredPolls.map((poll) => {
            const hasVotedYes = poll.yesVote.includes(teacherName);
            const hasVotedNo = poll.noVote.includes(teacherName);

            return (
              <li key={poll._id} className="teacher-poll-item">
                <h2 className="teacher-poll-title">{poll.title}</h2>
                <p className="teacher-poll-description">{poll.description}</p>

                <div className="teacher-poll-deadline-container">
                  <p className="teacher-poll-deadline">
                    🕒 Deadline: {formatDate(poll.lastDate)}
                  </p>
                  {poll.status === "open" && (
                    <p className="teacher-poll-countdown">
                      ⏳ Time Left: {getCountdown(poll.lastDate)}
                    </p>
                  )}
                </div>

                <p
                  className={`teacher-poll-status ${
                    poll.status === "open"
                      ? "teacher-poll-status-open"
                      : "teacher-poll-status-closed"
                  }`}
                >
                  {poll.status === "open" ? "✅ Voting is Open" : "❌ Voting is Closed"}
                </p>

                <div className="teacher-poll-vote-section">
                  {poll.status === "closed" ? (
                    <p className="teacher-poll-closed-message">
                      🚫 This poll is closed. Thank you for your participation!
                    </p>
                  ) : hasVotedYes ? (
                    <p className="teacher-poll-voted-message">
                      ✅ You have agreed with this poll.
                    </p>
                  ) : hasVotedNo ? (
                    <p className="teacher-poll-voted-message">
                      ❌ You have disagreed with this poll.
                    </p>
                  ) : (
                    <div className="teacher-poll-vote-buttons">
                      <button
                        className="teacher-poll-agree-button"
                        onClick={handleVoteClick(poll._id, "Yes")}
                      >
                        👍 Agree
                      </button>
                      <button
                        className="teacher-poll-disagree-button"
                        onClick={handleVoteClick(poll._id, "No")}
                      >
                        👎 Disagree
                      </button>
                    </div>
                  )}
                </div>
              </li>

            );
          })}
        </ul>
      ) : (
        <p className="teacher-poll-empty">
          ⚠️ No polls found in this category. Please check back later!
        </p>
      )}
    </div>
  );
}
