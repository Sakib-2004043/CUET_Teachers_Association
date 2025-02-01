import { NextResponse } from "next/server";
import userRegistrations from "@/Database/models/register";
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
    const mobile = body.get("phone");
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
      profileImage: imageBuffer
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return success response
    return NextResponse.json(
      { message: "User registered successfully" },
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

// Log In Part
export async function PUT(req) {

  try {
    // Connect to the database
    const JWT_SECRET = process.env.JWT_SECRET;

    await connectDB();

    // Parse the request body
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Find user by email
    const user = await userRegistrations.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Compare the password (Consider using bcrypt for secure password comparison)
    const isPasswordValid = password === user.password; // Replace with bcrypt.compare in production
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        mobile:user.mobile,
        notificationSeen: user.notificationSeen
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Token validity: 1 hour
    );

    // Respond with the token and user details
    return NextResponse.json(
      {
        message: 'Login successful.',
        token,
        role: user.role
      },{ status: 200 }
    );
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}

// PATCH method to retrieve seen notifications of a teacher
export async function PATCH(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const { email } = await req.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await userRegistrations.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Return the notificationSeen field
    return NextResponse.json(
      {
        message: "Notification count retrieved successfully.",
        notificationSeen: user.notificationSeen || 0, // Ensure default value if not set
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving notification count:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later.", details: error.message },
      { status: 500 }
    );
  }
}
