import ApiError from "../utils/ApiError.js";

export default function errorHandler(error, request, response, next) {
  if (response.headersSent) return next(error);
  const status = error instanceof ApiError ? error.statusCode : error.code === 11000 ? 409 : 500;
  const code = error instanceof ApiError ? error.code : error.code === 11000 ? "DUPLICATE_RESOURCE" : "INTERNAL_ERROR";
  const message = status === 500 ? "Something went wrong." : error.message;
  response.status(status).json({ message, code });
}
