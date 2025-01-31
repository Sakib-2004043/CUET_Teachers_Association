"use client";

import React, { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormat";
import "./complain.css";
import { resetAdminNotification } from "@/utils/notification";

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // Filter state
  

  // Fetch all complaints on component mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch("/api/complain");

        if (response.ok) {
          const data = await response.json();

          // Sort complaints in descending order by date
          const sortedComplaints = data.complaints.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          setComplaints(sortedComplaints);
          await resetAdminNotification("adminsNotification");
        } else {
          setError("Failed to fetch complaints.");
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError("An error occurred while fetching complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);


  // Handle reply text changes
  const handleReplyChange = (complaintId, value) => {
    setReplyText((prev) => ({
      ...prev,
      [complaintId]: value,
    }));
  };

  // Handle reply submission
  const handleReplySubmit = async (complaintId) => {
    const reply = replyText[complaintId]?.trim();

    if (!reply) {
      alert("Reply cannot be empty.");
      return;
    }

    try {
      const response = await fetch("/api/complain", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: complaintId,
          reply,
        }),
      });

      if (response.ok) {
        alert("Reply submitted successfully!");
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint._id === complaintId ? { ...complaint, reply } : complaint
          )
        );
        setReplyText((prev) => ({
          ...prev,
          [complaintId]: "",
        }));
      } else {
        alert("Failed to submit reply.");
      }
    } catch (err) {
      console.error("Error submitting reply:", err);
      alert("An error occurred while submitting the reply.");
    }
  };

  // Filter complaints based on selected category
  const filteredComplaints = complaints
  .filter((complaint) => {
    if (filterType === "all") return true;
    if (filterType === "replied") return complaint.reply !== "Waiting For Reply......";
    if (filterType === "unreplied") return complaint.reply === "Waiting For Reply......";
    return true;
  })
  .filter((complaint) => 
    searchQuery === "" || complaint.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // Highlight matching text
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<mark>$1</mark>`);
  };

  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-comp-complaints-page">
      {/* Search Bar */}
      <input
        type="text"
        className="admin-comp-search-bar"
        placeholder="Search by teacher name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Filter Buttons */}
      <div className="admin-comp-nav-button-container">
        <button 
          className="admin-comp-nav-button-all-complain"
          onClick={() => setFilterType("all")}
        >
          All Complaints
        </button>
        <button 
          className="admin-comp-nav-button-replied-complain"
          onClick={() => setFilterType("replied")}
        >
          Replied Complaints
        </button>
        <button 
          className="admin-comp-nav-button-unreplied-complain"
          onClick={() => setFilterType("unreplied")}
        >
          Unreplied Complaints
        </button>
      </div>

      {filteredComplaints.length > 0 ? (
        <ul className="admin-comp-complaints-list">
          {filteredComplaints.map((complaint) => (
            <li key={complaint._id} className="admin-comp-complaint-item">
              <div className="admin-comp-card admin-comp-teacher-name-card">
                <strong>Teacher Name:</strong>{" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightText(complaint.teacherName, searchQuery),
                  }}
                />
                <br />
                <br />
                <strong>Date:</strong> {formatDate(complaint.date)}
              </div>
              <div className="admin-comp-card admin-comp-complaint-card">
                <strong>Complaint:</strong>
                <br />
                <hr />
                {complaint.complain}
              </div>
              <div className="admin-comp-card admin-comp-reply-card">
                <strong>Reply:</strong>
                <br />
                <hr />
                {complaint.reply !== "Waiting For Reply......" ? (
                  <span>{complaint.reply}</span>
                ) : (
                  <div className="admin-comp-reply-input-container">
                    <textarea
                      placeholder="Write your reply here..."
                      className="admin-comp-reply-input"
                      value={replyText[complaint._id] || ""}
                      onChange={(e) =>
                        handleReplyChange(complaint._id, e.target.value)
                      }
                    />
                    <button
                      className="admin-comp-reply-submit-button"
                      onClick={() => handleReplySubmit(complaint._id)}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No complaints found.</p>
      )}
    </div>
  );
};

export default AdminComplaintsPage;
