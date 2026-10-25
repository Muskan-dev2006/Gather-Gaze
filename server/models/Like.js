import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
  },
  { timestamps: true },
);

likeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);
