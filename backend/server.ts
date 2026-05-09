/** HTTP API: Express app wiring, global middleware, route mounts. */
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { sql } from "drizzle-orm";
import { rateLimit } from "express-rate-limit";
import authRouter from "./routes/auth";
import taskRouter from "./routes/tasks";
import cookieParser from "cookie-parser";
import db from "./config/db";

const port = process.env.PORT ?? 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

const app = express();

// Middleware
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 40,
    message: "Too many requests, please try again later.",
  }),
);
app.use(morgan("dev"));
app.use(express.json());

// Routers
app.use("/api/tasks", taskRouter);
app.use("/api/auth", authRouter);

const logDatabaseConnectionStatus = async () => {
  try {
    await db.execute(sql`select 1`);
    console.log("Database connection check: connected");
  } catch (error) {
    const cause =
      error instanceof Error && "cause" in error ? error.cause : undefined;
    const reason =
      cause instanceof Error
        ? cause.message
        : error instanceof Error
          ? error.message.replace(/\s+/g, " ").trim()
          : String(error);
    console.error(`Database connection check: not connected (${reason})`);
  }
};

const startServer = async () => {
  await logDatabaseConnectionStatus();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

void startServer();
