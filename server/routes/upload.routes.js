import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import { getUploadSignature } from "../controllers/upload.controller.js";

const router = Router();

router.get("/signature", requireAuth, getUploadSignature);

export default router;