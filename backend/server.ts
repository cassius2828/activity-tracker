const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

// routers
const taskRouter = require("./routes/tasks");
const userRouter = require("./routes/users");
// middlewares
app.use(cors());
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
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
