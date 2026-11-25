import { z } from "zod";

export const reviewBodySchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().max(1000).optional(),
    photos: z.array(z.string().url()).max(4).optional(),
  }),
});

export const helpfulVoteParamsSchema = z.object({ params: z.object({ reviewId: z.string().regex(/^[a-f\d]{24}$/i) }) });
