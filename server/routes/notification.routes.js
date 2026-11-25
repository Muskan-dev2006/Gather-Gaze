import { Router } from "express";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../controllers/notification.controller.js";
import requireAuth from "../middleware/requireAuth.js";
import validate from "../middleware/validate.js";
import { notificationIdSchema } from "../validators/notification.validator.js";

const router = Router();
router.use(requireAuth);
router.get("/", getNotifications);
router.patch("/read", markAllNotificationsRead);
router.patch("/:id/read", validate({ params: notificationIdSchema.shape.params }), markNotificationRead);
export default router;
