import { Router } from "express";
import { createReview, getReviews } from "../controllers/review.controller.js";
import optionalAuth from "../middleware/optionalAuth.js";
import requireAuth from "../middleware/requireAuth.js";
import validate from "../middleware/validate.js";
import { recipeIdSchema } from "../validators/recipe.validator.js";
import { reviewBodySchema } from "../validators/review.validator.js";

const router = Router();
router.get("/:id/reviews", optionalAuth, validate({ params: recipeIdSchema.shape.params }), getReviews);
router.post("/:id/reviews", requireAuth, validate({ params: recipeIdSchema.shape.params, body: reviewBodySchema.shape.body }), createReview);
export default router;
