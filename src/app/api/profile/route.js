import { NextResponse } from "next/server";
import userRegistrations from "@/Database/models/register"; // Mongoose User model
import connectDB from "@/Database/connectDB";
import jwt from 'jsonwebtoken';
require('dotenv').config();

export async function GET(req) {
  try {
    // Connect to the database
    await connectDB();

    // Retrieve the user data from the database
    const user = await userRegistrations.find({});

    // Check if the user exists
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return the user data (excluding sensitive information like password)
    return NextResponse.json(
      { Data: user },
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
      {
        name: user.name,
        email: user.email,
        department: user.department,
        mobile: user.mobile,
        role: user.role,
        profileImage: user.profileImage
      },
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

export async function PUT(req) {
  try {
    // Parse the form data
    const formData = await req.formData();  // Use formData to parse multipart data

    // Get the token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token found." },
        { status: 401 }
      );
    }

    // Decode the JWT token to get the user info
    const decodedToken = jwt.decode(token);

    if (!decodedToken) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    // Extract user details from the formData
    const email = decodedToken.email;  // Use email from the token to find the user
    const name = formData.get("name");
    const department = formData.get("department");
    const mobile = formData.get("mobile");
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");

    // Handle the profile image if uploaded
    const profileImage = formData.get("profileImage");

    let imageBuffer = null;
    if (profileImage && profileImage instanceof Blob) {
      const bufferData = await profileImage.arrayBuffer();
      imageBuffer = Buffer.from(bufferData);
    }

    // Ensure connection to the database
    await connectDB();

    // Find the existing user by email
    const user = await userRegistrations.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // If the password is being updated, validate the old password and change it
    if (oldPassword && newPassword) {
      if (user.password !== oldPassword) {
        return NextResponse.json(
          { success: false, message: "Incorrect old password." },
          { status: 400 }
        );
      }
      user.password = newPassword;
    }

    // Update the user's details
    user.name = name || user.name;
    user.department = department || user.department;
    user.mobile = mobile || user.mobile;

    // Only update profileImage if a new image is provided
    if (imageBuffer) {
      user.profileImage = imageBuffer;
    }

    // Save the updated user information to the database
    const updatedUser = await user.save();

    // Return the success response with the updated user details
    return NextResponse.json(
      { message: "User updated successfully", data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error.message },
      { status: 500 }
    );
  }
}
