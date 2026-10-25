import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export default function optionalAuth(request, response, next) {
  const token = request.cookies?.session;
  if (token) {
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      request.user = { id: payload.sub };
    } catch {
      request.user = null;
    }
  }
  next();
}
