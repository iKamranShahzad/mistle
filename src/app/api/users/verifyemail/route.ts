import User from "@/app/models/User";
import connect from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  //API Route to verify user's email
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    const user = await User.findOne({
      // Find user by token and expiry
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      /// Check if the token is valid
      return NextResponse.json(
        { error: "Email Verification Link Expired" },
        { status: 400 }
      );
    }

    // Update user's email verification status
    user.isVerified = true;

    // Clear token and expiry
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    // Save user
    await user.save();

    return NextResponse.json({
      message: "Email Verified Successfully!",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
