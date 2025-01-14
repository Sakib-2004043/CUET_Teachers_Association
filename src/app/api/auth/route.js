import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  // Extract the Authorization header
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json(
      { message: 'Unauthorized: No token provided' },
      { status: 401 }
    );
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decode : ",decoded)

    // If token is valid, respond with success
    return NextResponse.json(
      { message: 'Authorized', user: decoded },
      { status: 200 }
    );
  } 
  catch (error) {
    console.error('Token verification error:', error);

    // If token is invalid or expired, respond with error
    return NextResponse.json(
      { message: 'Unauthorized: Invalid or expired token' },
      { status: 201 }
    );
  }
}
