import rateLimit from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 100;

export default rateLimit({
  windowMs: WINDOW_MS,
  limit: MAX_REQUESTS,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler(request, response, next) {
    next(new ApiError(429, "Too many requests. Try again shortly.", "RATE_LIMITED"));
  },
});
