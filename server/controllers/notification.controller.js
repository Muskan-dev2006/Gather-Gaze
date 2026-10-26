import Notification from "../models/Notification.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (request, response) => {
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ recipientId: request.user.id }).sort({ createdAt: -1 }).limit(50)
      .populate("actorId", "name avatarUrl").populate("recipeId", "title slug coverUrl").lean(),
    Notification.countDocuments({ recipientId: request.user.id, isRead: false }),
  ]);
  response.json({ notifications, unreadCount });
});

export const markNotificationRead = asyncHandler(async (request, response) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: request.params.id, recipientId: request.user.id }, { isRead: true }, { new: true },
  ).lean();
  if (!notification) throw new ApiError(404, "Notification not found.", "NOT_FOUND");
  response.json({ notification });
});

export const markAllNotificationsRead = asyncHandler(async (request, response) => {
  await Notification.updateMany({ recipientId: request.user.id, isRead: false }, { isRead: true });
  response.json({ unreadCount: 0 });
});
