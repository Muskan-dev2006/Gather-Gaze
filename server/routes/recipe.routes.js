import { Router } from "express";
import {
  createRecipe,
  deleteRecipe,
  getRecipeBySlug,
  updateRecipe,
} from "../controllers/recipe.controller.js";
import optionalAuth from "../middleware/optionalAuth.js";
import requireAuth from "../middleware/requireAuth.js";
import validate from "../middleware/validate.js";
import {
  createRecipeSchema,
  recipeIdSchema,
  recipeSlugSchema,
  updateRecipeSchema,
} from "../validators/recipe.validator.js";

const router = Router();

router.post("/", requireAuth, validate({ body: createRecipeSchema.shape.body }), createRecipe);
router.get("/:slug", optionalAuth, validate({ params: recipeSlugSchema.shape.params }), getRecipeBySlug);
router.put("/:id", requireAuth, validate({
  params: updateRecipeSchema.shape.params,
  body: updateRecipeSchema.shape.body,
}), updateRecipe);
router.delete("/:id", requireAuth, validate({ params: recipeIdSchema.shape.params }), deleteRecipe);

export default router;