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

// Find complaints by teacher name
export async function PUT(req) {
  try {
    // Connect to the database
    await connectDB();

    // Get the request data
    const { teacherName } = await req.json();

    // Validate input data
    if (!teacherName) {
      return NextResponse.json(
        { message: "Teacher name is required." },
        { status: 400 }
      );
    }

    // Find complaints by teacher name
    const complaints = await Complains.find({ teacherName });
    // Return the complaints if found
    return NextResponse.json(
      { message: "Complaints fetched successfully.", complaints },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json(
      { message: "Failed to fetch complaints." },
      { status: 500 }
    );
  }
}


// Finding All complaints
export async function GET(req) {
  try {
    // Connect to the database
    await connectDB();

    // Find complaints by teacher name
    const complaints = await Complains.find({});
    // Return the complaints if found
    return NextResponse.json(
      { message: "Complaints fetched successfully.", complaints },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json(
      { message: "Failed to fetch complaints." },
      { status: 500 }
    );
  }
}

// Update complaint reply by ID
export async function PATCH(req) {
  try {
    // Connect to the database
    await connectDB();

    // Get the request data (ID and reply)
    const { id, reply } = await req.json();

    // Validate input data
    if (!id || !reply) {
      return NextResponse.json(
        { message: "ID and reply are required." },
        { status: 400 }
      );
    }

    // Find the complaint by ID and update the reply
    const updatedComplaint = await Complains.findByIdAndUpdate(
      id,
      { reply },
      { new: true } // Return the updated document
    );

    // If the complaint doesn't exist, return a not found error
    if (!updatedComplaint) {
      return NextResponse.json(
        { message: "Complaint not found." },
        { status: 404 }
      );
    }

    // Return a success response with the updated complaint
    return NextResponse.json(
      { message: "Reply updated successfully", updatedComplaint },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating reply:", error);
    return NextResponse.json(
      { message: "Failed to update reply." },
      { status: 500 }
    );
  }
}

