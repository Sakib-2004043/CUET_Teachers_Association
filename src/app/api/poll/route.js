import { NextResponse } from "next/server";
import Polls from "@/Database/models/poll"; // Your Mongoose Poll model
import connectDB from "@/Database/connectDB"; // Database connection

export async function GET(req) {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all polls from the database
    const allPolls = await Polls.find({});

    // Return a success response with the list of polls
    return NextResponse.json(
      { message: "Polls fetched successfully.", polls: allPolls },
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


export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the JSON data from the request
    const body = await req.json();

    // Extract poll data from the request body
    const { topic, lastDate, status } = body;

    // Validate required fields
    if (!topic || !lastDate) {
      return NextResponse.json(
        { message: "Topic and last date are required." },
        { status: 400 }
      );
    }

    // Create a new poll document
    const newPoll = new Polls({
      topic,
      lastDate,
      status: status || "open", // Default to "open" if status is not provided
    });

    // Save the poll to the database
    const savedPoll = await newPoll.save();

    // Return a success response
    return NextResponse.json(
      { message: "Poll created successfully.", poll: savedPoll },
      { status: 201 }
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
