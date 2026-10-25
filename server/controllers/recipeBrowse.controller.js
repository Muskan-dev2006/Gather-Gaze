import Recipe from "../models/Recipe.js";
import asyncHandler from "../utils/asyncHandler.js";
import { attachUserFlags } from "../utils/attachUserFlags.js";
import { decodeCursor, fetchCursorPage } from "../utils/cursor.js";

const SEARCH_RESULT_LIMIT = 30;

export const getRecipes = asyncHandler(async function getRecipes(request, response) {
  const filters = buildRecipeFilters(request.query);
  if (request.query.cursor) filters._id = { $lt: decodeCursor(request.query.cursor) };
  const query = Recipe.find(filters);
  const { items, nextCursor } = await fetchCursorPage(query, request.query.limit);
  const flaggedRecipes = await attachUserFlags(items, request.user?.id);
  response.json({ items: flaggedRecipes.map(toRecipeCard), nextCursor });
});

export const searchRecipes = asyncHandler(async function searchRecipes(request, response) {
  const filters = buildRecipeFilters(request.query);
  const recipes = await Recipe.find({ ...filters, $text: { $search: request.query.q } })
    .select({ score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" }, _id: -1 })
    .limit(SEARCH_RESULT_LIMIT)
    .lean();
  const flaggedRecipes = await attachUserFlags(recipes, request.user?.id);
  response.json({ items: flaggedRecipes.map(toRecipeCard), nextCursor: null });
});

function buildRecipeFilters(query) {
  const filters = {};
  if (query.cuisine) filters.cuisine = query.cuisine;
  if (query.diet) filters.diet = query.diet;
  if (query.maxTime) filters.cookTime = { $lte: query.maxTime };
  if (query.difficulty) filters.difficulty = query.difficulty;
  return filters;
}

function toRecipeCard(recipe) {
  return {
    _id: String(recipe._id),
    slug: recipe.slug,
    title: recipe.title,
    coverUrl: recipe.coverUrl,
    cuisine: recipe.cuisine,
    diet: recipe.diet,
    cookTime: recipe.cookTime,
    difficulty: recipe.difficulty,
    ratingSum: recipe.ratingSum || 0,
    ratingCount: recipe.ratingCount || 0,
    likeCount: recipe.likeCount || 0,
    isLiked: recipe.isLiked,
    isSaved: recipe.isSaved,
  };
}
