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

const app = express();

app.use(cors());
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

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

app.use(express.json());

app.use("/api/tasks", taskRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
