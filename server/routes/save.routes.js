import { Router } from "express";
import { addSave, removeSave } from "../controllers/save.controller.js";
import requireAuth from "../middleware/requireAuth.js";
import validate from "../middleware/validate.js";
import { recipeIdSchema } from "../validators/recipe.validator.js";

const router = Router();
router.post("/:id/save", requireAuth, validate({ params: recipeIdSchema.shape.params }), addSave);
router.delete("/:id/save", requireAuth, validate({ params: recipeIdSchema.shape.params }), removeSave);
export default router;
