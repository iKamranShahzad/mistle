import mongoose from "mongoose";

// Connect to MongoDB
const connect = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log("MongoDB Connected");
  } catch (error) {
    throw new Error("Error connecting to mongoose");
  }
};

export default connect;
