import { NextResponse } from "next/server";
import Notifications from "@/Database/models/notification";
import connectDB from "@/Database/connectDB"; // Database connection

// Get All Notifications
export async function GET(req) {
  try {
    // Connect to the database
    await connectDB();
    // Fetch all notifications from the database
    const allNotifications = await Notifications.find({});
    // Return a success response with the list of notifications
    return NextResponse.json(
      { message: "Notifications fetched successfully.", notifications: allNotifications },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error fetching notifications:", error);
    // Return an error response
    return NextResponse.json(
      { message: "Failed to fetch notifications.", error: "An error occurred while fetching notifications." },
      { status: 500 }
    );
  }
}

// POST method to increase the notification count for a specific memberType
export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const { memberType } = await req.json();

    // Increment the notification 1
    const result = await Notifications.findOneAndUpdate(
      {}, 
      { $inc: { [memberType]: 1 } }, 
      { new: true, upsert: true } 
    );
    // Return a success response with the updated notification
    return NextResponse.json(
      { message: "Notification count updated successfully.", notification: result },
      { status: 200 }
    );

  } 
  catch (error) {
    console.error("Error updating notification count:", error);
    // Return an error response
    return NextResponse.json(
      { message: "Failed to update notification count.", error: "An error occurred while updating the notification count." },
      { status: 500 }
    );
  }
}