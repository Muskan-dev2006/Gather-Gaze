import { Router } from "express";
import { followUser, getFollowStatus, unfollowUser } from "../controllers/follow.controller.js";
import requireAuth from "../middleware/requireAuth.js";
import validate from "../middleware/validate.js";
import { recipeIdSchema } from "../validators/recipe.validator.js";

const router = Router();
router.use(requireAuth);
router.get("/:id/follow", validate({ params: recipeIdSchema.shape.params }), getFollowStatus);
router.post("/:id/follow", validate({ params: recipeIdSchema.shape.params }), followUser);
router.delete("/:id/follow", validate({ params: recipeIdSchema.shape.params }), unfollowUser);
export default router;
