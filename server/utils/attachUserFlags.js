import Like from "../models/Like.js";
import Save from "../models/Save.js";

export async function attachUserFlags(recipes, userId) {
  const plainRecipes = recipes.map((recipe) => recipe.toObject ? recipe.toObject() : recipe);
  if (!plainRecipes.length || !userId) return withEmptyFlags(plainRecipes);

  const recipeIds = plainRecipes.map(({ _id }) => _id);
  const [likes, saves] = await Promise.all([
    Like.find({ userId, recipeId: { $in: recipeIds } }).select("recipeId").lean(),
    Save.find({ userId, recipeId: { $in: recipeIds } }).select("recipeId").lean(),
  ]);
  const likedRecipeIds = new Set(likes.map(({ recipeId }) => String(recipeId)));
  const savedRecipeIds = new Set(saves.map(({ recipeId }) => String(recipeId)));

  return plainRecipes.map((recipe) => ({
    ...recipe,
    isLiked: likedRecipeIds.has(String(recipe._id)),
    isSaved: savedRecipeIds.has(String(recipe._id)),
  }));
}

function withEmptyFlags(recipes) {
  return recipes.map((recipe) => ({ ...recipe, isLiked: false, isSaved: false }));
}
