import User from "@/app/models/User";
import connect from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  //API Route to send a reset password link
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    const user = await User.findOne({ email }); // Find user by email

    if (!user) {
      // Check if the user exists
      return NextResponse.json(
        { error: "No Linked Account Found!" },
        { status: 400 }
      );
    }

    // Send reset password email
    await sendEmail({ email, emailType: "RESET", userId: user._id });

    return NextResponse.json({ message: "Reset Password Link Sent!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
