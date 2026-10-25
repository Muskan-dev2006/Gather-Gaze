import Recipe from "../models/Recipe.js";
import Save from "../models/Save.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

async function requireRecipe(recipeId) {
  if (!await Recipe.exists({ _id: recipeId })) throw new ApiError(404, "Recipe not found.", "NOT_FOUND");
}

export const addSave = asyncHandler(async (request, response) => {
  const { id: recipeId } = request.params;
  await requireRecipe(recipeId);
  await Save.create({ userId: request.user.id, recipeId });
  response.status(201).json({ isSaved: true });
});

export const removeSave = asyncHandler(async (request, response) => {
  const { id: recipeId } = request.params;
  await requireRecipe(recipeId);
  await Save.findOneAndDelete({ userId: request.user.id, recipeId });
  response.json({ isSaved: false });
});
