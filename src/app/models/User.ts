import mongoose from "mongoose";

const { Schema } = mongoose;

// This schema will store the user data
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      default: "",
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },

  { timestamps: true }
);

// This will create a model for the user schema
const User = mongoose.models.users || mongoose.model("users", userSchema); // If the model already exists, use that model
export default User;
