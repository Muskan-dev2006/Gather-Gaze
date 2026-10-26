import Like from "../models/Like.js";
import Recipe from "../models/Recipe.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Notification from "../models/Notification.js";

export const addLike = asyncHandler(async (request, response) => {
  const { id: recipeId } = request.params;
  const recipeDocument = await Recipe.findById(recipeId).select("authorId");
  if (!recipeDocument) throw new ApiError(404, "Recipe not found.", "NOT_FOUND");
  await Like.create({ userId: request.user.id, recipeId });
  if (recipeDocument.authorId.toString() !== request.user.id) {
    await Notification.create({ recipientId: recipeDocument.authorId, actorId: request.user.id, recipeId, type: "like" });
  }
  const recipe = await Recipe.findByIdAndUpdate(recipeId, { $inc: { likeCount: 1 } }, { new: true }).select("likeCount").lean();
  response.status(201).json({ isLiked: true, likeCount: recipe.likeCount });
});

export const removeLike = asyncHandler(async (request, response) => {
  const { id: recipeId } = request.params;
  await requireRecipe(recipeId);
  const removed = await Like.findOneAndDelete({ userId: request.user.id, recipeId });
  const recipe = removed
    ? await Recipe.findByIdAndUpdate(recipeId, { $inc: { likeCount: -1 } }, { new: true }).select("likeCount").lean()
    : await Recipe.findById(recipeId).select("likeCount").lean();
  response.json({ isLiked: false, likeCount: recipe.likeCount });
});
