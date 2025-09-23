import mongoose from "mongoose";

export const connectDB = async () => {
  // 0-disconnected, 1-connected, 2-connecting, 3-disconnecting
  if (mongoose.connection.readyState >= 1) return; // already connected/connecting -> return (don't try to connet again)

  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
