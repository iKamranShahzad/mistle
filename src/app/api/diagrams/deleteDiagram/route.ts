import Diagram from "@/app/models/Diagram";
import connect from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  //API Route to Delete a diagram
  const { searchParams } = new URL(request.url);
  const diagramID = searchParams.get("diagramID");

  if (!diagramID) {
    // Check if the diagram ID is provided
    return new NextResponse("Diagram ID is required", { status: 400 });
  }

  await connect();

  try {
    // Check if the diagram exists
    const diagram = await Diagram.findById(diagramID);

    if (!diagram) {
      // If the diagram is not found
      return new NextResponse("Diagram Not Found!", { status: 404 });
    }

    // Delete the diagram
    await Diagram.findByIdAndDelete(diagramID);

    return NextResponse.json({
      message: "Diagram deleted successfully",
      success: true,
      status: 200,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
