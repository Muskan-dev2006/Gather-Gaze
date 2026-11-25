import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import User from "../models/User.js";
import { env } from "../config/env.js";

let io;

function readSessionCookie(header = "") {
  for (const pair of header.split(";")) {
    const separator = pair.indexOf("=");
    if (separator < 0) continue;
    if (pair.slice(0, separator).trim() === "session") {
      return decodeURIComponent(pair.slice(separator + 1).trim());
    }
  }
  return "";
}

export function configureNotificationSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.clientOrigin, credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      if (!env.jwtSecret) throw new Error("Unauthorized");
      const token = readSessionCookie(socket.handshake.headers.cookie);
      const payload = jwt.verify(token, env.jwtSecret);
      const userExists = await User.exists({ _id: payload.sub });
      if (!userExists) throw new Error("Unauthorized");
      socket.data.userId = String(payload.sub);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.data.userId}`);
  });

  return io;
}

export function emitNewNotification(recipientId, notification, unreadCount) {
  io?.to(`user:${recipientId}`).emit("notification:new", { notification, unreadCount });
}

export function emitUnreadCount(recipientId, unreadCount) {
  io?.to(`user:${recipientId}`).emit("notification:count", { unreadCount });
}
