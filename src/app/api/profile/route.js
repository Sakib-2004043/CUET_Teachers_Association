import { NextResponse } from "next/server";
import userRegistrations from "@/Database/models/register"; // Mongoose User model
import connectDB from "@/Database/connectDB";

export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the incoming request body
    const { email } = await req.json();

    // Check if studentId is provided
    if (!email) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the user data from the database
    const user = await userRegistrations.findOne({ email });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Respond with user data (excluding sensitive information like password)
    return NextResponse.json(
      { profileImage: user.profileImage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
