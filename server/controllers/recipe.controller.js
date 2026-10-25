import Recipe from "../models/Recipe.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { attachUserFlags } from "../utils/attachUserFlags.js";
import User from "../models/User.js";

function slugify(title) {
  return title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "recipe";
}

async function uniqueSlug(title, excludedRecipeId) {
  const base = slugify(title);
  const filter = excludedRecipeId ? { _id: { $ne: excludedRecipeId } } : {};
  let candidate = base;
  let suffix = 2;

  while (await Recipe.exists({ ...filter, slug: candidate })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export const createRecipe = asyncHandler(async (request, response) => {
  const recipe = await Recipe.create({
    ...request.body,
    slug: await uniqueSlug(request.body.title),
    authorId: request.user.id,
  });
  await recipe.populate("authorId", "name avatarUrl");
  response.status(201).json({ recipe });
});

export const getRecipeBySlug = asyncHandler(async (request, response) => {
  const recipe = await Recipe.findOne({ slug: request.params.slug }).populate({
    path: "authorId",
    select: "name avatarUrl",
    model: User,
  });
  if (!recipe) throw new ApiError(404, "Recipe not found.", "NOT_FOUND");

  const userId = request.user?.id;
  const [recipeWithFlags] = await attachUserFlags([recipe], userId);
  const isAuthor = Boolean(userId && userId === recipe.authorId._id.toString());
  response.json({ recipe: { ...recipeWithFlags, isAuthor } });
});

export const updateRecipe = asyncHandler(async (request, response) => {
  const recipe = await Recipe.findById(request.params.id);
  if (!recipe) throw new ApiError(404, "Recipe not found.", "NOT_FOUND");
  if (recipe.authorId.toString() !== request.user.id) {
    throw new ApiError(403, "You can only edit your own recipes.", "FORBIDDEN");
  }

  Object.assign(recipe, request.body);
  if (request.body.title) recipe.slug = await uniqueSlug(request.body.title, recipe._id);
  await recipe.save();
  await recipe.populate("authorId", "name avatarUrl");
  response.json({ recipe });
});

export const deleteRecipe = asyncHandler(async (request, response) => {
  const recipe = await Recipe.findById(request.params.id);
  if (!recipe) throw new ApiError(404, "Recipe not found.", "NOT_FOUND");
  if (recipe.authorId.toString() !== request.user.id) {
    throw new ApiError(403, "You can only delete your own recipes.", "FORBIDDEN");
  }

  await recipe.deleteOne();
  response.json({ message: "Recipe deleted." });
});