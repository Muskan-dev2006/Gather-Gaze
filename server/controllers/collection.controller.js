import Collection from "../models/Collection.js";
import Recipe from "../models/Recipe.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const recipePopulate = { path: "recipeIds", select: "title slug coverUrl cuisine diet cookTime difficulty ratingSum ratingCount likeCount authorId", populate: { path: "authorId", select: "name avatarUrl" } };

const starterCollectionSpecs = [
  { name: "Weeknight favorites", filter: { cookTime: { $lte: 30 } } },
  { name: "Plant-based plates", filter: { diet: { $in: ["veg", "vegan"] } } },
  { name: "Something sweet", filter: { tags: "dessert" } },
];

async function ensureStarterCollections(userId) {
  if (await User.exists({ _id: userId, starterCollectionsCreated: true })) return;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const user = await User.findOne({ _id: userId, starterCollectionsCreated: { $ne: true } }).session(session);
      if (!user) return;
      const hasCollections = await Collection.exists({ userId }).session(session);
      if (!hasCollections) {
        const starterCollections = await Promise.all(starterCollectionSpecs.map(async ({ name, filter }) => ({
          userId,
          name,
          recipeIds: (await Recipe.find(filter).sort({ ratingCount: -1, _id: 1 }).limit(5).select("_id").session(session).lean()).map(({ _id }) => _id),
        })));
        await Collection.insertMany(starterCollections, { session });
      }
      user.starterCollectionsCreated = true;
      await user.save({ session });
    });
  } finally {
    await session.endSession();
  }
}

export const listCollections = asyncHandler(async (request, response) => {
  await ensureStarterCollections(request.user.id);
  const collections = await Collection.find({ userId: request.user.id }).sort({ updatedAt: -1 }).populate(recipePopulate).lean();
  for (const collection of collections) collection.recipeIds = collection.recipeIds.filter(Boolean);
  response.json({ collections });
});

export const createCollection = asyncHandler(async (request, response) => {
  try {
    const collection = await Collection.create({ userId: request.user.id, name: request.body.name });
    response.status(201).json({ collection });
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, "You already have a collection with that name.", "DUPLICATE_RESOURCE");
    throw error;
  }
});

export const deleteCollection = asyncHandler(async (request, response) => {
  const result = await Collection.deleteOne({ _id: request.params.collectionId, userId: request.user.id });
  if (!result.deletedCount) throw new ApiError(404, "Collection not found.", "NOT_FOUND");
  response.json({ deleted: true });
});

export const addRecipeToCollection = asyncHandler(async (request, response) => {
  const [collection, recipe] = await Promise.all([
    Collection.findOne({ _id: request.params.collectionId, userId: request.user.id }),
    Recipe.findById(request.body.recipeId).select("_id"),
  ]);
  if (!collection) throw new ApiError(404, "Collection not found.", "NOT_FOUND");
  if (!recipe) throw new ApiError(404, "Recipe not found.", "NOT_FOUND");
  if (!collection.recipeIds.some((id) => id.equals(recipe._id))) {
    collection.recipeIds.push(recipe._id);
    await collection.save();
  }
  response.json({ collectionId: collection.id, recipeId: recipe.id, added: true });
});

export const removeRecipeFromCollection = asyncHandler(async (request, response) => {
  const collection = await Collection.findOne({ _id: request.params.collectionId, userId: request.user.id });
  if (!collection) throw new ApiError(404, "Collection not found.", "NOT_FOUND");
  collection.recipeIds.pull(request.params.recipeId);
  await collection.save();
  response.json({ collectionId: collection.id, recipeId: request.params.recipeId, removed: true });
});
