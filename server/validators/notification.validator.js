import { z } from "zod";

export const notificationIdSchema = z.object({ params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }) });
