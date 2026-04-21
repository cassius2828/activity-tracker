const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

// routers
const taskRouter = require("./routes/tasks");
const authRouter = require("./routes/auth");
// middlewares
app.use(cors());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 40, // limit each IP to 40 requests per windowMs
    message: "Too many requests, please try again later.",
  }),
);
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(express.json());

// routers
app.use("/api/tasks", taskRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
