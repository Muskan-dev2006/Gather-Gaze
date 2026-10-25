import mongoose from "mongoose";

const saveSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
  },
  { timestamps: true },
);

saveSchema.index({ userId: 1, recipeId: 1 }, { unique: true });
saveSchema.index({ userId: 1, _id: -1 });

export default mongoose.model("Save", saveSchema);
