// Maps the public recipe browse and search endpoints.
import { Router } from "express";
import { getRecipes, searchRecipes } from "../controllers/recipeBrowse.controller.js";
import optionalAuth from "../middleware/optionalAuth.js";
import validate from "../middleware/validate.js";
import { recipeListQuery, recipeSearchQuery } from "../middleware/recipeBrowse.validator.js";

const router = Router();

router.get("/search", optionalAuth, validate({ query: recipeSearchQuery }), searchRecipes);
router.get("/", optionalAuth, validate({ query: recipeListQuery }), getRecipes);

export default router;
