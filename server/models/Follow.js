import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  followedId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

followSchema.index({ followerId: 1, followedId: 1 }, { unique: true });
followSchema.index({ followedId: 1, createdAt: -1 });

export default mongoose.model("Follow", followSchema);
