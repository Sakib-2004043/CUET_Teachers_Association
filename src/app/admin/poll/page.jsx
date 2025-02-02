'use client';

import React, { useState, useEffect } from "react";
import "./poll.css";
import { formatDate } from "@/utils/dateFormat";
import { setNotification } from "@/utils/notification";
import dynamic from "next/dynamic";

const LOADING_MESSAGE = `Loading Polls...`;
const ERROR_MESSAGE = `An error occurred while fetching the polls.`;
const NO_POLLS_MESSAGE = `No polls available.`;

const CreatePoll = () => {
  const [title, setTitle] = useState(""); // Poll title
  const [description, setDescription] = useState(""); // Poll description
  const [lastDate, setLastDate] = useState(""); // Poll deadline
  const [status, setStatus] = useState("open"); // Poll status
  const [polls, setPolls] = useState([]); // State to store all polls
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all polls from the API
  const fetchPolls = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/poll");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Sort polls in descending order by createDate
      const sortedPolls = data.polls.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

      setPolls(sortedPolls);
    } catch (error) {
      console.error("Error fetching polls:", error);
      setError(ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls(); // Fetch polls on component mount
  }, []);

  // Handle form submission for creating a new poll
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const pollData = {
      title,
      description,
      lastDate,
      status,
      createDate: new Date().toISOString(), // Add createDate field
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
  
      const newPoll = await response.json();
  
      // Instantly update the polls state and sort it in descending order
      setPolls((prevPolls) =>
        [pollData, ...prevPolls].sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
      );
  
      // Reset form fields
      setTitle("");
      setDescription("");
      setLastDate("");
      setStatus("open");
  
      await setNotification("teachersNotification");
  
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };
  
  

  // Handle view details button click
  const handleViewDetails = (poll) => {
    setSelectedPoll(poll); // Set the selected poll to display its details
  };

  return (
    <div className="admin-poll-container">
      <div className="admin-poll-layout">
        <div className="admin-poll-section poll-create">
          <h1 className="admin-poll-title">Create a New Poll</h1>
          <form className="admin-poll-form" onSubmit={handleSubmit}>
            <div className="admin-poll-field">
              <label htmlFor="title" className="admin-poll-label">
                Poll Title:
              </label>
              <input
                type="text"
                id="title"
                className="admin-poll-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the poll title"
                required
              />
            </div>
            <div className="admin-poll-field">
              <label htmlFor="description" className="admin-poll-label">
                Poll Description:
              </label>
              <textarea
                id="description"
                className="admin-poll-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the poll description"
                required
              />
            </div>
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
            <button type="submit" className="admin-poll-submit">
              Create Poll
            </button>
          </form>
        </div>

        <div className="admin-poll-section admin-poll-list">
          <h2 className="admin-poll-subtitle">All Polls</h2>
          <div className="admin-poll-scrollable">
            {loading ? (
              <p className="admin-poll-loading">{LOADING_MESSAGE}</p>
            ) : error ? (
              <p className="admin-poll-error">{ERROR_MESSAGE}</p>
            ) : polls.length > 0 ? (
              <ul className="admin-poll-items">
                {polls.map((poll) => (
                  <li key={poll._id} className="admin-poll-item">
                    <h3 className="admin-poll-item-title">{poll.title}</h3>
                    <p className="admin-poll-item-description">{poll.description}</p>
                    <p className="admin-poll-item-date">Deadline: {formatDate(poll.lastDate)}</p>
                    <p className={`admin-poll-item-status ${poll.status}`}>Status: {poll.status}</p>
                    <button className="admin-poll-view-details" onClick={() => handleViewDetails(poll)}>
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-poll-empty">{NO_POLLS_MESSAGE}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CreatePoll), { ssr: false });
//export default CreatePoll
