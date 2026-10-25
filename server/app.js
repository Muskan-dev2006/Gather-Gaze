import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { env } from "./config/env.js";
import ApiError from "./utils/ApiError.js";

const app = express();
const serverDirectory = dirname(fileURLToPath(import.meta.url));
const futureRouteMounts = [
  ["/api/recipes", "./routes/recipe.routes.js"],
  ["/api/uploads", "./routes/upload.routes.js"],
  ["/api/recipes", "./routes/review.routes.js"],
  ["/api/recipes", "./routes/like.routes.js"],
  ["/api/recipes", "./routes/save.routes.js"],
  ["/api/me", "./routes/me.routes.js"],
  ["/api/notifications", "./routes/notification.routes.js"],
];

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.get("/health", (request, response) => response.json({ status: "ok" }));
app.use("/api", rateLimiter);
app.use("/api/auth", authRouter);
await mountAvailableRoutes(app);
app.use((request, response, next) => next(new ApiError(404, "Route not found.", "NOT_FOUND")));
app.use(errorHandler);

async function mountAvailableRoutes(application) {
  for (const [basePath, relativePath] of futureRouteMounts) {
    const routePath = resolve(serverDirectory, relativePath);
    try {
      await access(routePath);
      const { default: router } = await import(pathToFileURL(routePath).href);
      application.use(basePath, router);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}

export default app;
