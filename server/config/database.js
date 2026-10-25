import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  await mongoose.connect(env.mongoUri);
  process.stdout.write(`MongoDB connected to database "${mongoose.connection.name}".\n`);
}
