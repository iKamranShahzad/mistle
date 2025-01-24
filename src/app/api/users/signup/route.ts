import User from "@/app/models/User";
import connect from "@/app/utils/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/helpers/mailer";

export const POST = async (request: NextRequest) => {
  //API Route to create a new user
  const reqBody = await request.json();
  const { email, password } = reqBody;
  await connect();

  //check if user already exists
  const user = await User.findOne({ email });

  if (user) {
    // Check if the user exists
    return new NextResponse("Email already in use!", { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new User({
    email,
    password: hashedPassword,
  });

  // Save the user
  try {
    const savedUser = await newUser.save();

    // send confirmation mail to the registered user's email id
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      status: 200,
      savedUser,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
