"use client";
import React, { useState, useEffect } from "react";
import "./poll.css";

const CreatePoll = () => {
  const [topic, setTopic] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [status, setStatus] = useState("open");
  const [polls, setPolls] = useState([]); // State to store all polls

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

  useEffect(() => {
    fetchPolls(); // Fetch polls on component mount
  }, []);

  // Handle form submission for creating a new poll
  const handleSubmit = async (e) => {
    e.preventDefault();

    const pollData = {
      topic,
      lastDate,
      status,
    };

    try {
      const response = await fetch("/api/poll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Poll created successfully:", data);
      fetchPolls(); // Refresh the list of polls after creation
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  return (
    <div className="admin-poll-container">
      <h1 className="admin-poll-title">Create a New Poll</h1>
      <form className="admin-poll-form" onSubmit={handleSubmit}>
        {/* Poll Topic */}
        <div className="admin-poll-field">
          <label htmlFor="topic" className="admin-poll-label">
            Poll Topic:
          </label>
          <input
            type="text"
            id="topic"
            className="admin-poll-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter the poll topic"
            required
          />
        </div>

        {/* Poll Last Date */}
        <div className="admin-poll-field">
          <label htmlFor="lastDate" className="admin-poll-label">
            Poll Deadline:
          </label>
          <input
            type="date"
            id="lastDate"
            className="admin-poll-input"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
            required
          />
        </div>

        {/* Poll Status */}
        <div className="admin-poll-field">
          <label htmlFor="status" className="admin-poll-label">
            Poll Status:
          </label>
          <select
            id="status"
            className="admin-poll-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="admin-poll-submit">
          Create Poll
        </button>
      </form>

      {/* Display All Polls */}
      <div className="admin-poll-list">
        <h2 className="admin-poll-subtitle">All Polls</h2>
        {polls.length > 0 ? (
          <ul className="admin-poll-items">
            {polls.map((poll) => (
              <li key={poll._id} className="admin-poll-item">
                <h3 className="admin-poll-item-title">{poll.topic}</h3>
                <p className="admin-poll-item-date">
                  Deadline: {new Date(poll.lastDate).toLocaleDateString()}
                </p>
                <p className={`admin-poll-item-status ${poll.status}`}>
                  Status: {poll.status}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-poll-empty">No polls available.</p>
        )}
      </div>
    </div>
  );
};

export default CreatePoll;
