import mongoose from "mongoose";

const reviewHelpfulVoteSchema = new mongoose.Schema({
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Review", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

reviewHelpfulVoteSchema.index({ reviewId: 1, userId: 1 }, { unique: true });

export default mongoose.model("ReviewHelpfulVote", reviewHelpfulVoteSchema);
