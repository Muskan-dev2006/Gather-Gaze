import { z } from "zod";
import { DIETS, DIFFICULTIES } from "../models/Recipe.js";

const imageCreditSchema = z.object({
	photographerName: z.string().trim().max(120).optional(),
	photographerUrl: z.string().url().optional(),
	sourceUrl: z.string().url().optional(),
});

const ingredientSchema = z.object({
	name: z.string().trim().min(1).max(120),
	qty: z.number().min(0),
	unit: z.string().trim().max(40).optional(),
});

const stepSchema = z.object({
	order: z.number().int().min(1),
	text: z.string().trim().min(1).max(2000),
});

export const recipeFieldsSchema = z.object({
	title: z.string().trim().min(1).max(120),
	description: z.string().trim().max(500).optional(),
	coverUrl: z.string().url(),
	imageCredit: imageCreditSchema.optional(),
	cuisine: z.string().trim().min(1).max(80),
	diet: z.enum(DIETS),
	difficulty: z.enum(DIFFICULTIES),
	cookTime: z.number().int().min(1),
	servings: z.number().int().min(1),
	tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
	ingredients: z.array(ingredientSchema).min(1).max(100),
	steps: z.array(stepSchema).min(1).max(100),
});

export const createRecipeSchema = z.object({ body: recipeFieldsSchema });
export const updateRecipeSchema = z.object({
	params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
	body: recipeFieldsSchema.partial().refine((fields) => Object.keys(fields).length > 0, {
		message: "Provide at least one recipe field to update.",
	}),
});
export const recipeIdSchema = z.object({ params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }) });
export const recipeSlugSchema = z.object({ params: z.object({ slug: z.string().trim().min(1).max(160) }) });