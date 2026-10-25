import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";

export default async function requireAuth(request, response, next) {
  try {
    const token = request.cookies?.session;
    if (!token) throw new ApiError(401, "Sign in to continue.", "UNAUTHORIZED");
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select("_id");
    if (!user) throw new ApiError(401, "Your session has expired.", "UNAUTHORIZED");
    request.user = { id: user.id };
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, "Your session has expired.", "UNAUTHORIZED"));
  }
}
