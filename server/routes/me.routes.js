import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import { getMyProfile, getMyRecipes, getMySavedRecipes } from "../controllers/me.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/recipes", getMyRecipes);
router.get("/saved", getMySavedRecipes);
router.get("/profile", getMyProfile);

export default router;