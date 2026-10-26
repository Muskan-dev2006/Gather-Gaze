import Recipe from "../models/Recipe.js";
import Review from "../models/Review.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Notification from "../models/Notification.js";

const REVIEW_LIMIT = 50;

async function requireRecipe(recipeId) {
  if (!await Recipe.exists({ _id: recipeId })) throw new ApiError(404, "Recipe not found.", "NOT_FOUND");
}

export const getReviews = asyncHandler(async (request, response) => {
  const { id: recipeId } = request.params;
  await requireRecipe(recipeId);
  const [reviews, currentUserReview] = await Promise.all([
    Review.find({ recipeId }).sort({ createdAt: -1 }).limit(REVIEW_LIMIT).populate("userId", "name avatarUrl").lean(),
    request.user ? Review.findOne({ recipeId, userId: request.user.id }).lean() : null,
  ]);
  response.json({ reviews, currentUserReview });
});

export const createReview = asyncHandler(async (request, response) => {
  const { id: recipeId } = request.params;
  const { rating, comment = "" } = request.body;
  await requireRecipe(recipeId);

  let review = await Review.findOne({ recipeId, userId: request.user.id });
  let ratingCountDelta = 0;
  let ratingSumDelta = rating;
  if (review) {
    ratingSumDelta = rating - review.rating;
    review.rating = rating;
    review.comment = comment;
    await review.save();
  } else {
    try {
      review = await Review.create({ recipeId, userId: request.user.id, rating, comment });
      ratingCountDelta = 1;
    } catch (error) {
      if (error.code === 11000) throw new ApiError(409, "You already reviewed this recipe. Refresh and try again.", "DUPLICATE_RESOURCE");
      throw error;
    }
    const recipe = await Recipe.findById(recipeId).select("authorId");
    if (recipe && recipe.authorId.toString() !== request.user.id) {
      await Notification.create({ recipientId: recipe.authorId, actorId: request.user.id, recipeId, type: "review" });
    }
  }

  await Recipe.updateOne({ _id: recipeId }, { $inc: { ratingSum: ratingSumDelta, ratingCount: ratingCountDelta } });
  await review.populate("userId", "name avatarUrl");
  response.json({ review });
});
