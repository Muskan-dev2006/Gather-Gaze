import { Router } from "express";
import { getCurrentUser, logout, signInWithGoogle } from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/me", asyncHandler(getCurrentUser));
router.post("/google", asyncHandler(signInWithGoogle));
router.post("/logout", asyncHandler(logout));

export default router;
