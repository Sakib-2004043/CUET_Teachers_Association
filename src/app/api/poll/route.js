import { NextResponse } from "next/server";
import Polls from "@/Database/models/poll";
import connectDB from "@/Database/connectDB";

// Get All Polls and Update Status
export async function GET(req) {
  try {
    // Connect to the database
    await connectDB();

    // Get current date
    const currentDate = new Date();

    // Fetch all polls from the database
    const allPolls = await Polls.find({});

    // Update status based on lastDate
    const updatedPolls = await Promise.all(
      allPolls.map(async (poll) => {
        if (poll.lastDate < currentDate && poll.status !== "closed") {
          poll.status = "closed";
          await poll.save(); // Save the updated poll
        }
        return poll;
      })
    );

    // Return a success response with the updated polls
    return NextResponse.json(
      { message: "Polls fetched successfully.", polls: updatedPolls },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching polls:", error);

    // Return an error response
    return NextResponse.json(
      { message: "Failed to fetch polls.", error: error.message },
      { status: 500 }
    );
  }
}

// Creating Poll
export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the JSON data from the request
    const body = await req.json();

    // Extract poll data from the request body
    const { title, description, lastDate, status } = body;

    // Validate required fields
    if (!title || !description || !lastDate) {
      return NextResponse.json(
        { message: "Title, description, and last date are required." },
        { status: 400 }
      );
    }

    // Create a new poll document
    const newPoll = new Polls({
      title,
      description,
      lastDate,
      status: status || "open", // Default to "open" if not provided
    });

    // Save the poll to the database
    const savedPoll = await newPoll.save();

    // Return a success response
    return NextResponse.json(
      { message: "Poll created successfully.", poll: savedPoll },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating poll:", error);

    // Return an error response
    return NextResponse.json(
      { message: "Failed to create poll.", error: error.message },
      { status: 500 }
    );
  }
}

// Giving Vote
export async function PUT(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the JSON data from the request
    const body = await req.json();

    // Extract pollId, vote, and teacherName from the request body
    const { pollId, vote, teacherName } = body;

    // Validate required fields
    if (!pollId || !vote || !teacherName) {
      return NextResponse.json(
        { message: "Poll ID, vote, and teacher name are required." },
        { status: 400 }
      );
    }

    // Find the poll by ID
    const poll = await Polls.findById(pollId);

    if (!poll) {
      return NextResponse.json(
        { message: "Poll not found." },
        { status: 404 }
      );
    }

    // Check if the poll status is "open"
    if (poll.status !== "open") {
      return NextResponse.json(
        { message: "Voting is closed for this poll." },
        { status: 400 }
      );
    }

    // Update the vote arrays based on the vote type
    if (vote === "Yes") {
      if (!poll.yesVote.includes(teacherName)) {
        poll.yesVote.push(teacherName);
      }
      // Remove from noVote if previously voted "No"
      poll.noVote = poll.noVote.filter((name) => name !== teacherName);
    } else if (vote === "No") {
      if (!poll.noVote.includes(teacherName)) {
        poll.noVote.push(teacherName);
      }
      // Remove from yesVote if previously voted "Yes"
      poll.yesVote = poll.yesVote.filter((name) => name !== teacherName);
    } else {
      return NextResponse.json(
        { message: "Invalid vote type. Use 'Yes' or 'No'." },
        { status: 400 }
      );
    }

    // Save the updated poll
    await poll.save();

    // Return a success response
    return NextResponse.json(
      { message: "Vote recorded successfully.", poll },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing vote:", error);

    // Return an error response
    return NextResponse.json(
      { message: "Failed to record vote.", error: error.message },
      { status: 500 }
    );
  }
}