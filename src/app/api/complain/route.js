import { NextResponse } from "next/server";
import Complains from "@/Database/models/complain"; // Your Mongoose Complaints model
import connectDB from "@/Database/connectDB"; // Database connection

// Create a new complaint
export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();

    // Get the request data
    const { teacherName, complain } = await req.json();

    // Validate input data
    if (!teacherName || !complain) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Create a new complaint document
    const newComplaint = new Complains({
      teacherName,
      complain,
    });

    // Save the complaint to the database
    await newComplaint.save();

    // Return a success response
    return NextResponse.json(
      { message: "Complaint submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating complaint:", error);
    return NextResponse.json(
      { message: "Failed to submit complaint." },
      { status: 500 }
    );
  }
}
