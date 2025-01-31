import { NextResponse } from "next/server";
import Notifications from "@/Database/models/notification";
import userRegistrations from "@/Database/models/register"; 
import connectDB from "@/Database/connectDB"; 

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

// PUT method to set Admin Notification To Zero
export async function PUT(req) {
  try {

    // Connect to the database
    await connectDB();

    // Parse the request body
    const { memberType } = await req.json();
    console.log("Received memberType:", memberType);

    if (!memberType) {
      console.error("Missing memberType in request body");
      return NextResponse.json(
        { message: "Missing memberType in request body." },
        { status: 400 }
      );
    }

    // Update the notification count to zero
    const result = await Notifications.findOneAndUpdate(
      {},
      { $set: { [memberType]: 0 } },
      { new: true, upsert: true }
    );

    if (!result) {
      console.error("No document found or updated.");
      return NextResponse.json(
        { message: "No matching document found for update." },
        { status: 404 }
      );
    }

    console.log("Updated notification:", result);

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
      { message: "Failed to update notification count.", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH method to update Teacher Notification count
export async function PATCH(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const { email, finalCount } = await req.json();

    if (!email || finalCount === undefined) {
      console.error("Missing required fields in request body");
      return NextResponse.json(
        { message: "Missing email or finalCount in request body." },
        { status: 400 }
      );
    }

    // Update the notification count for the given email
    const result = await userRegistrations.findOneAndUpdate(
      { email },
      { $set: { notificationSeen: finalCount } },
      { new: true, upsert: true }
    );

    if (!result) {
      console.error("No matching document found or updated.");
      return NextResponse.json(
        { message: "No matching document found for update." },
        { status: 404 }
      );
    }
    
    // Return a success response with the updated notification
    return NextResponse.json(
      { message: "Notification count updated successfully.", notification: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notification count:", error);

    // Return an error response
    return NextResponse.json(
      { message: "Failed to update notification count.", error: error.message },
      { status: 500 }
    );
  }
}
