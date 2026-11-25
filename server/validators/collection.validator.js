import { z } from "zod";

const id = z.string().regex(/^[a-f\d]{24}$/i);
export const collectionParamsSchema = z.object({ params: z.object({ collectionId: id }) });
export const collectionRecipeParamsSchema = z.object({ params: z.object({ collectionId: id, recipeId: id }) });
export const createCollectionBodySchema = z.object({ body: z.object({ name: z.string().trim().min(1).max(60) }) });
export const addCollectionRecipeSchema = z.object({
  params: z.object({ collectionId: id }),
  body: z.object({ recipeId: id }),
});
