import Follow from "../models/Follow.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../utils/createNotification.js";

export const getFollowStatus = asyncHandler(async (request, response) => {
  const { id: followedId } = request.params;
  if (followedId === request.user.id) return response.json({ isFollowing: false });
  response.json({ isFollowing: Boolean(await Follow.exists({ followerId: request.user.id, followedId })) });
});

export const followUser = asyncHandler(async (request, response) => {
  const { id: followedId } = request.params;
  const followerId = request.user.id;
  if (followedId === followerId) throw new ApiError(400, "You cannot follow yourself.", "INVALID_ACTION");
  const followedUser = await User.findById(followedId).select("_id");
  if (!followedUser) throw new ApiError(404, "Cook not found.", "NOT_FOUND");
  try {
    await Follow.create({ followerId, followedId });
  } catch (error) {
    if (error.code === 11000) return response.json({ isFollowing: true });
    throw error;
  }
  await createNotification({ recipientId: followedId, actorId: followerId, type: "follow" });
  response.status(201).json({ isFollowing: true });
});

export const unfollowUser = asyncHandler(async (request, response) => {
  await Follow.findOneAndDelete({ followerId: request.user.id, followedId: request.params.id });
  response.json({ isFollowing: false });
});
