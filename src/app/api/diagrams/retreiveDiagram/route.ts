import User from "@/app/models/User";
import Diagram from "@/app/models/Diagram";
import connect from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  //API Route to fetch a diagram by diagramID
  const { searchParams } = new URL(request.url);
  const userID = searchParams.get("userID");
  const diagramID = searchParams.get("diagramID");

  if (!userID) {
    // Check if the user ID is provided
    return new NextResponse("User ID is required", { status: 400 });
  }

  if (!diagramID) {
    // Check if the diagram ID is provided
    return new NextResponse("Diagram ID is required", { status: 400 });
  }

  await connect();

  try {
    // Check if user exists
    const user = await User.findById(userID);
    if (!user) {
      return new NextResponse("User Not Found!", { status: 404 });
    }

    // Fetch the diagram by diagramID
    const diagram = await Diagram.findById(diagramID);
    if (!diagram) {
      return new NextResponse("Diagram Not Found!", { status: 404 });
    }

    // Check if the diagram's owner matches the userID
    if (diagram.owner.toString() !== userID) {
      return new NextResponse("User ID does not match the diagram owner", {
        status: 403,
      });
    }

    return NextResponse.json({
      message: "Diagram fetched successfully",
      success: true,
      status: 200,
      diagram,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
