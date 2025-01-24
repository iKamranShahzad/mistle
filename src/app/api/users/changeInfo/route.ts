import User from "@/app/models/User";
import connect from "@/app/utils/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  // Change user's name and password
  try {
    const reqBody = await request.json();
    const { UserID, newName, newPassword } = reqBody;

    const user = await User.findById(UserID);

    if (!user) {
      // Check if the user exists
      return NextResponse.json({ error: "User Not Found!" }, { status: 400 });
    }
    if (newPassword) {
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 5);
      // Update user's password
      user.password = hashedPassword;
    }
    user.name = newName; // Update user's name
    await user.save();

    return NextResponse.json({ message: "Changes saved successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
