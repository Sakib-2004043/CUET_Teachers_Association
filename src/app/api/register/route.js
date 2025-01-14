import { NextResponse } from "next/server";
import userRegistrations from "@/Database/models/register"; // Mongoose User model
import connectDB from "@/Database/connectDB";
import jwt from 'jsonwebtoken';
require('dotenv').config()

export async function POST(req) {
  try {
    // Parse form data from the request
    const body = await req.formData();

    // Retrieve form fields and file
    const name = body.get("name");
    const email = body.get("email");
    const password = body.get("password");
    const department = body.get("department");
    const mobile = body.get("mobile");
    const file = body.get("profileImage"); // The uploaded file

    // Validate file existence
    if (!file) {
      console.error("File not found in the request.");
      return NextResponse.json(
        { success: false, message: "Profile image not found." },
        { status: 202 }
      );
    }

    // Convert file to Buffer
    const bufferData = await file.arrayBuffer();
    const imageBuffer = Buffer.from(bufferData);

    console.log("Image buffer:", imageBuffer);

    // Ensure connection to the database
    await connectDB();

    // Creating a new user
    const newUser = new userRegistrations({
      name,
      email,
      password,
      department,
      mobile,
      role: "Member",
      profileImage: imageBuffer, // Store image as buffer
    });

    console.log("Creating new user:", newUser);

    // Save the user to the database
    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser);

    // Return success response
    return NextResponse.json(
      { message: "User registered successfully", data: savedUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error storing data:", error);
    return NextResponse.json(
      { error: "Failed to register user", details: error.message },
      { status: 500 }
    );
  }
}
