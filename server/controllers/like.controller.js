import Like from "../models/Like.js";
import Recipe from "../models/Recipe.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

async function requireRecipe(recipeId) {
  if (!await Recipe.exists({ _id: recipeId })) throw new ApiError(404, "Recipe not found.", "NOT_FOUND");
}

export const addLike = asyncHandler(async (request, response) => {
  const { id: recipeId } = request.params;
  await requireRecipe(recipeId);
  await Like.create({ userId: request.user.id, recipeId });
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
