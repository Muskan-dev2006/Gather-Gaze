import { z } from "zod";
import { DIETS, DIFFICULTIES } from "../models/Recipe.js";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;
const MAX_SEARCH_LENGTH = 120;
const CURSOR_LENGTH = 32;
const CURSOR_PATTERN = /^[A-Za-z0-9_-]+$/;

const recipeFilters = {
  cuisine: z.string().trim().min(1).max(80).optional(),
  diet: z.enum(DIETS).optional(),
  maxTime: z.coerce.number().int().positive().optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
};

export const recipeListQuery = z.object({
  ...recipeFilters,
  cursor: z.string().length(CURSOR_LENGTH).regex(CURSOR_PATTERN, "The cursor is invalid.").optional(),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export const recipeSearchQuery = z.object({
  ...recipeFilters,
  q: z.string().trim().min(1).max(MAX_SEARCH_LENGTH),
});
