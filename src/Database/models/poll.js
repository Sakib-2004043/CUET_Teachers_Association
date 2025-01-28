import mongoose from "mongoose";

const PollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now, // Automatically sets the current date
  },
  lastDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "open",
  },
  noVote: {
    type: [String], // Array of strings
    set: (v) => [...new Set(v)], // Ensure unique values
    default: [],
  },
  yesVote: {
    type: [String], // Array of strings
    set: (v) => [...new Set(v)], // Ensure unique values
    default: [],
  },
});

const Polls = mongoose.models.Polls || mongoose.model("Polls", PollSchema);

module.exports = Polls
