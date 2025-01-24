import mongoose from "mongoose";

const { Schema } = mongoose;

// This schema will store the diagram data
const diagramSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed, // This will store the JSON data
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

// This will create a model for the diagram schema
const Diagram =
  // If the model already exists, use that model
  mongoose.models.diagrams || mongoose.model("diagrams", diagramSchema);
export default Diagram;
