import ApiError from "../utils/ApiError.js";

export default function validate(schemas) {
  return function validateRequest(request, response, next) {
    for (const [part, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(request[part]);
      if (!result.success) return next(new ApiError(400, result.error.issues[0].message, "VALIDATION_ERROR"));
      Object.defineProperty(request, part, { configurable: true, writable: true, value: result.data });
    }
    next();
  };
}
