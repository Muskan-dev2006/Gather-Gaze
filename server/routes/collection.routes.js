import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import validate from "../middleware/validate.js";
import { addRecipeToCollection, createCollection, deleteCollection, listCollections, removeRecipeFromCollection } from "../controllers/collection.controller.js";
import { addCollectionRecipeSchema, collectionParamsSchema, collectionRecipeParamsSchema, createCollectionBodySchema } from "../validators/collection.validator.js";

const router = Router();
router.use(requireAuth);
router.get("/", listCollections);
router.post("/", validate({ body: createCollectionBodySchema.shape.body }), createCollection);
router.delete("/:collectionId", validate({ params: collectionParamsSchema.shape.params }), deleteCollection);
router.post("/:collectionId/recipes", validate({ params: addCollectionRecipeSchema.shape.params, body: addCollectionRecipeSchema.shape.body }), addRecipeToCollection);
router.delete("/:collectionId/recipes/:recipeId", validate({ params: collectionRecipeParamsSchema.shape.params }), removeRecipeFromCollection);
export default router;
