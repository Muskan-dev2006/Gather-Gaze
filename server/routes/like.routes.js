import { Router } from "express";
import { addLike, removeLike } from "../controllers/like.controller.js";
import requireAuth from "../middleware/requireAuth.js";
import validate from "../middleware/validate.js";
import { recipeIdSchema } from "../validators/recipe.validator.js";

const router = Router();
router.post("/:id/like", requireAuth, validate({ params: recipeIdSchema.shape.params }), addLike);
router.delete("/:id/like", requireAuth, validate({ params: recipeIdSchema.shape.params }), removeLike);
export default router;
