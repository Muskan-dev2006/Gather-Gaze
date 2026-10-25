import Recipe from "../models/Recipe.js";
import asyncHandler from "../utils/asyncHandler.js";
import { attachUserFlags } from "../utils/attachUserFlags.js";
import { decodeCursor, fetchCursorPage } from "../utils/cursor.js";

const SEARCH_RESULT_LIMIT = 30;

export const getRecipes = asyncHandler(async function getRecipes(request, response) {
  const filters = buildRecipeFilters(request.query);
  if (request.query.cursor) filters._id = { $lt: decodeCursor(request.query.cursor) };
  const query = Recipe.find(filters).populate("authorId", "name avatarUrl");
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
    .populate("authorId", "name avatarUrl")
    .lean();
  const flaggedRecipes = await attachUserFlags(recipes, request.user?.id);
  response.json({ items: flaggedRecipes.map(toRecipeCard) });
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
  const author = recipe.authorId;
  const ratingCount = recipe.ratingCount || 0;
  return {
    _id: String(recipe._id),
    title: recipe.title,
    slug: recipe.slug,
    description: recipe.description,
    coverUrl: recipe.coverUrl,
    imageCredit: recipe.imageCredit,
    cuisine: recipe.cuisine,
    diet: recipe.diet,
    difficulty: recipe.difficulty,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    tags: recipe.tags,
    author: author ? { id: String(author._id), name: author.name, avatarUrl: author.avatarUrl || null } : null,
    rating: { average: ratingCount ? recipe.ratingSum / ratingCount : 0, count: ratingCount },
    likeCount: recipe.likeCount || 0,
    isLiked: recipe.isLiked,
    isSaved: recipe.isSaved,
    createdAt: recipe.createdAt,
  };
}
