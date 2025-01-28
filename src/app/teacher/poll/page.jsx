"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./poll.css";

export default function TeacherPoll() {
  const [polls, setPolls] = useState([]); // State to store all polls
  const [teacherName, setTeacherName] = useState(""); // State to store teacher's name

  // Fetch all polls from the API
  const fetchPolls = async () => {
    try {
      const response = await fetch("/api/poll");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPolls(data.polls); // Update the polls state
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
        setTeacherName(decoded.name || decoded.username || "Unknown Teacher");
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

      const result = await response.json();
      console.log("Vote submitted successfully:", result);

      // Refetch polls to update the UI
      fetchPolls();
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  return (
    <div className="teacher-poll-page-container">
      <h1 className="teacher-poll-page-title">All Polls</h1>
      {polls.length > 0 ? (
        <ul className="teacher-poll-list">
          {polls.map((poll) => {
            // Check if the teacher has already voted
            const hasVotedYes = poll.yesVote.includes(teacherName);
            const hasVotedNo = poll.noVote.includes(teacherName);

            return (
              <li key={poll._id} className="teacher-poll-item">
                <h2 className="teacher-poll-title">{poll.title}</h2>
                <p className="teacher-poll-description">{poll.description}</p>
                <p className="teacher-poll-deadline">
                  Deadline: {new Date(poll.lastDate).toLocaleDateString()}
                </p>
                <p
                  className={`teacher-poll-status ${
                    poll.status === "open"
                      ? "teacher-poll-status-open"
                      : "teacher-poll-status-closed"
                  }`}
                >
                  Status: {poll.status}
                </p>
                {/* Voting Section */}
                <div className="teacher-poll-vote-section">
                  {poll.status === "closed" ? (
                    <p className="teacher-poll-closed-message">Voting is closed.</p>
                  ) : hasVotedYes ? (
                    <p className="teacher-poll-voted-message">You agreed with this poll.</p>
                  ) : hasVotedNo ? (
                    <p className="teacher-poll-voted-message">You disagreed with this poll.</p>
                  ) : (
                    <div className="teacher-poll-vote-buttons">
                      <button
                        className="teacher-poll-agree-button"
                        onClick={handleVoteClick(poll._id, "Yes")}
                      >
                        Agree
                      </button>
                      <button
                        className="teacher-poll-disagree-button"
                        onClick={handleVoteClick(poll._id, "No")}
                      >
                        Disagree
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="teacher-poll-empty">No polls available.</p>
      )}
    </div>
  );
}
