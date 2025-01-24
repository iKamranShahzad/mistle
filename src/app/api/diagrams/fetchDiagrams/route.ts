import User from "@/app/models/User";
import Diagram from "@/app/models/Diagram";
import connect from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  //API Route to fetch all diagrams for a user
  const { searchParams } = new URL(request.url);
  const userID = searchParams.get("userID");

  if (!userID) {
    // Check if the user ID is provided
    return new NextResponse("User ID is required", { status: 400 });
  }

  await connect();

  try {
    // Check if user exists
    const user = await User.findById(userID);

    if (!user) {
      // If the user is not found
      return new NextResponse("User Not Found!", { status: 404 });
    }

    // Fetch all diagrams for the user
    const diagrams = await Diagram.find({ owner: userID });

    if (!diagrams || diagrams.length === 0) {
      // If no diagrams are found
      return new NextResponse("No Diagrams Found!", { status: 404 });
    }

    return NextResponse.json({
      message: "Diagrams fetched successfully",
      success: true,
      status: 200,
      diagrams,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
