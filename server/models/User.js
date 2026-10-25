import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    avatarUrl: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
