import Recipe from "../models/Recipe.js";
import Review from "../models/Review.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../utils/createNotification.js";
import ReviewHelpfulVote from "../models/ReviewHelpfulVote.js";
import mongoose from "mongoose";

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
  const votes = request.user && reviews.length
    ? await ReviewHelpfulVote.distinct("reviewId", { userId: request.user.id, reviewId: { $in: reviews.map(({ _id }) => _id) } })
    : [];
  const votedIds = new Set(votes.map(String));
  response.json({ reviews: reviews.map((review) => ({ ...review, hasVotedHelpful: votedIds.has(String(review._id)) })), currentUserReview });
});

export const createReview = asyncHandler(async (request, response) => {
  const { id: recipeId } = request.params;
  const { rating, comment = "" } = request.body;
  await requireRecipe(recipeId);

  const session = await mongoose.startSession();
  let review;
  let isFirstReview = false;
  try {
    await session.withTransaction(async () => {
      const existing = await Review.findOne({ recipeId, userId: request.user.id }).session(session);
      isFirstReview = !existing;
      const previousRating = existing?.rating || 0;
      if (existing) {
        existing.rating = rating;
        existing.comment = comment;
        existing.photos = request.body.photos || [];
        review = await existing.save({ session });
      } else {
        [review] = await Review.create([{ recipeId, userId: request.user.id, rating, comment, photos: request.body.photos || [] }], { session });
      }
      await Recipe.updateOne({ _id: recipeId }, { $inc: { ratingSum: rating - previousRating, ratingCount: isFirstReview ? 1 : 0 } }, { session });
    });
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, "You already reviewed this recipe. Refresh and try again.", "DUPLICATE_RESOURCE");
    throw error;
  } finally {
    await session.endSession();
  }
  if (isFirstReview) {
    const recipe = await Recipe.findById(recipeId).select("authorId");
    if (recipe && recipe.authorId.toString() !== request.user.id) {
      await createNotification({ recipientId: recipe.authorId, actorId: request.user.id, recipeId, type: "review" });
    }
  }
  await review.populate("userId", "name avatarUrl");
  response.json({ review });
});

export const toggleHelpfulVote = asyncHandler(async (request, response) => {
  const { reviewId } = request.params;
  const session = await mongoose.startSession();
  let isHelpful;
  try {
    await session.withTransaction(async () => {
      const review = await Review.findById(reviewId).session(session);
      if (!review) throw new ApiError(404, "Review not found.", "NOT_FOUND");
      if (review.userId.toString() === request.user.id) throw new ApiError(400, "You cannot vote on your own review.", "INVALID_ACTION");
      const vote = await ReviewHelpfulVote.findOne({ reviewId, userId: request.user.id }).session(session);
      if (vote) {
        await vote.deleteOne({ session });
        await Review.updateOne({ _id: reviewId }, { $inc: { helpfulCount: -1 } }, { session });
        isHelpful = false;
      } else {
        await ReviewHelpfulVote.create([{ reviewId, userId: request.user.id }], { session });
        await Review.updateOne({ _id: reviewId }, { $inc: { helpfulCount: 1 } }, { session });
        isHelpful = true;
      }
    });
  } finally {
    await session.endSession();
  }
  const { helpfulCount } = await Review.findById(reviewId).select("helpfulCount").lean();
  response.json({ isHelpful, helpfulCount });
});
