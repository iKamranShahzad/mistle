import User from "@/app/models/User";
import Diagram from "@/app/models/Diagram";
import connect from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const reqBody = await request.json();
  const { userID, diagName, diagData } = reqBody;
  await connect();

  try {
    // Check if user already exists
    const user = await User.findById(userID);

    if (!user) {
      return new NextResponse("User Not Found!", { status: 404 });
    }

    // Check if a diagram with the same name already exists for this user
    let existingDiagram = await Diagram.findOne({
      name: diagName,
      owner: userID,
    });

    if (existingDiagram) {
      // If the diagram already exists, update its data
      existingDiagram.data = diagData;
      const updatedDiagram = await existingDiagram.save();

      return NextResponse.json({
        message: "Diagram updated successfully",
        success: true,
        status: 200,
        diagramID: updatedDiagram._id,
        updatedDiagram,
      });
    } else {
      // Create a new diagram if it doesn't already exist
      const newDiagram = new Diagram({
        name: diagName,
        data: diagData,
        owner: userID,
      });

      const savedDiagram = await newDiagram.save();

      return NextResponse.json({
        message: "Diagram created successfully",
        success: true,
        status: 201,
        diagramID: savedDiagram._id,
        savedDiagram,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
