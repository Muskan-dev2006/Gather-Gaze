import Like from "../models/Like.js";
import Recipe from "../models/Recipe.js";
import Save from "../models/Save.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { attachUserFlags } from "../utils/attachUserFlags.js";
import { decodeCursor, fetchCursorPage } from "../utils/cursor.js";

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 30;

function getPageOptions(query) {
  const requestedLimit = query.limit === undefined ? DEFAULT_PAGE_SIZE : Number(query.limit);
  if (!Number.isInteger(requestedLimit) || requestedLimit < 1 || requestedLimit > MAX_PAGE_SIZE) {
    throw new ApiError(400, `limit must be an integer between 1 and ${MAX_PAGE_SIZE}.`, "VALIDATION_ERROR");
  }
  return {
    limit: requestedLimit,
    cursorId: query.cursor ? decodeCursor(query.cursor) : null,
  };
}

export const getMyRecipes = asyncHandler(async (request, response) => {
  const { limit, cursorId } = getPageOptions(request.query);
  const filter = { authorId: request.user.id };
  if (cursorId) filter._id = { $lt: cursorId };

  const page = await fetchCursorPage(Recipe.find(filter).populate("authorId", "name avatarUrl"), limit);
  const recipes = await attachUserFlags(page.items, request.user.id);
  response.json({ recipes, nextCursor: page.nextCursor });
});

export const getMySavedRecipes = asyncHandler(async (request, response) => {
  const { limit, cursorId } = getPageOptions(request.query);
  const filter = { userId: request.user.id };
  if (cursorId) filter._id = { $lt: cursorId };

  const page = await fetchCursorPage(Save.find(filter).populate({
      path: "recipeId",
      populate: { path: "authorId", select: "name avatarUrl" },
    }), limit);
  const savedPage = page.items.filter((save) => save.recipeId);
  const recipes = await attachUserFlags(savedPage.map((save) => save.recipeId), request.user.id);
  const savedRecipes = recipes.map((recipe) => ({ ...recipe, isSaved: true }));
  response.json({ recipes: savedRecipes, nextCursor: page.nextCursor });
});

export const getMyProfile = asyncHandler(async (request, response) => {
  const [user, publishedRecipes, savedRecipes, authoredRecipeIds] = await Promise.all([
    User.findById(request.user.id).select("name email avatarUrl createdAt").lean(),
    Recipe.countDocuments({ authorId: request.user.id }),
    Save.countDocuments({ userId: request.user.id }),
    Recipe.find({ authorId: request.user.id }).distinct("_id"),
  ]);
  if (!user) throw new ApiError(404, "Profile not found.", "NOT_FOUND");

  const likesReceived = authoredRecipeIds.length
    ? await Like.countDocuments({ recipeId: { $in: authoredRecipeIds } })
    : 0;
  response.json({
    profile: {
      user,
      counts: { publishedRecipes, likesReceived, savedRecipes },
    },
  });
});