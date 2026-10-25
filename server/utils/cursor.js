import mongoose from "mongoose";
import ApiError from "./ApiError.js";

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;
const CURSOR_LOOKAHEAD_COUNT = 1;

export function encodeCursor(id) {
  const hexId = String(id);
  if (!OBJECT_ID_PATTERN.test(hexId)) throw invalidCursor();
  return Buffer.from(hexId, "utf8").toString("base64url");
}

export function decodeCursor(cursor) {
  try {
    const id = Buffer.from(cursor, "base64url").toString("utf8");
    if (!OBJECT_ID_PATTERN.test(id) || Buffer.from(id, "utf8").toString("base64url") !== cursor) {
      throw invalidCursor();
    }
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw invalidCursor();
  }
}

export async function fetchCursorPage(query, limit) {
  const results = await query.sort({ _id: -1 }).limit(limit + CURSOR_LOOKAHEAD_COUNT).lean();
  const hasMore = results.length > limit;
  const items = hasMore ? results.slice(0, limit) : results;
  return { items, nextCursor: hasMore ? encodeCursor(items.at(-1)._id) : null };
}

function invalidCursor() {
  return new ApiError(400, "The cursor is invalid.", "INVALID_CURSOR");
}
