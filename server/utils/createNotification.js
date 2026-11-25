import Notification from "../models/Notification.js";
import { emitNewNotification } from "../realtime/notificationSocket.js";

export default async function createNotification(fields) {
  const notification = await Notification.create(fields);
  await notification.populate([
    { path: "actorId", select: "name avatarUrl" },
    { path: "recipeId", select: "title slug coverUrl" },
  ]);
  const unreadCount = await Notification.countDocuments({ recipientId: fields.recipientId, isRead: false });
  emitNewNotification(fields.recipientId, notification.toObject(), unreadCount);
  return notification;
}
