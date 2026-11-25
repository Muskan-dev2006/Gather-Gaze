import { createServer } from "node:http";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { configureNotificationSocket } from "./realtime/notificationSocket.js";

if (env.mongoUri) await connectDatabase();
else process.stdout.write("MongoDB connection skipped: set MONGODB_URI in server/.env.\n");

const httpServer = createServer(app);
configureNotificationSocket(httpServer);
httpServer.listen(env.port, () => {
  process.stdout.write(`Server started on port ${env.port}.\n`);
});
