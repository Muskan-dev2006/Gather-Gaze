import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";

const googleClient = new OAuth2Client(env.googleClientId);
const SESSION_COOKIE = "session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS * 1000,
    path: "/",
  };
}

export async function getCurrentUser(request, response) {
  const token = request.cookies?.[SESSION_COOKIE];
  if (!token) return response.json({ user: null });

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select("name email avatarUrl createdAt").lean();
    if (!user) {
      response.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: "lax", path: "/" });
      return response.json({ user: null });
    }
    return response.json({ user });
  } catch {
    response.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: "lax", path: "/" });
    return response.json({ user: null });
  }
}

export async function signInWithGoogle(request, response) {
  if (!env.googleClientId || !env.jwtSecret) {
    throw new ApiError(503, "Sign-in is not configured on the server.", "AUTH_NOT_CONFIGURED");
  }

  const { idToken } = request.body || {};
  if (typeof idToken !== "string" || !idToken) {
    throw new ApiError(400, "A Google ID token is required.", "VALIDATION_ERROR");
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: env.googleClientId });
    payload = ticket.getPayload();
  } catch {
    throw new ApiError(401, "Google could not verify your sign-in. Please try again.", "INVALID_GOOGLE_TOKEN");
  }

  if (!payload?.sub || !payload.email || !payload.email_verified) {
    throw new ApiError(401, "Your Google account must have a verified email address.", "INVALID_GOOGLE_ACCOUNT");
  }

  const user = await User.findOneAndUpdate(
    { googleId: payload.sub },
    {
      $set: {
        email: payload.email.toLowerCase(),
        name: payload.name || payload.email,
        ...(payload.picture ? { avatarUrl: payload.picture } : {}),
      },
      $setOnInsert: { googleId: payload.sub },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  ).select("name email avatarUrl createdAt").lean();

  const session = jwt.sign({}, env.jwtSecret, { subject: user._id.toString(), expiresIn: SESSION_DURATION_SECONDS });
  response.cookie(SESSION_COOKIE, session, sessionCookieOptions());
  return response.json({ user });
}

export function logout(request, response) {
  response.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response.status(204).end();
}
