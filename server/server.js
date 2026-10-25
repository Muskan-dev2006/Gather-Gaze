import { createServer } from "node:http";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

if (process.env.MONGODB_URI) await connectDatabase();

createServer(app).listen(env.port);
