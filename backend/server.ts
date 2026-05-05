/** HTTP API: Express app wiring, global middleware, route mounts. */
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import authRouter from "./routes/auth";
import taskRouter from "./routes/tasks";
import cookieParser from "cookie-parser";

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

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
