import type { Request, Response } from "express";
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { users } = require("../config/schema");

const login = async (req: Request, res: Response) => {
  const inValidLoginAttemptResponse = res
    .status(401)
    .json({ message: "Invalid email or password" });
  try {
    const { email, password } = req.body;
    //   create User model with AWS SQL DB
    const user = await db
      .select()
      .from(users)
      .where(users.email === email);
    if (!user) {
      return inValidLoginAttemptResponse;
    }
    // check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return inValidLoginAttemptResponse;
    }
    // create token for user
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body;
    // check if user already exists
    const user = await db
      .select()
      .from(users)
      .where(users.email === email);

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db
      .insert(users)
      .values({ email, password: hashedPassword })
      .returning();
      // create token for new user
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  login,
  register,
};
