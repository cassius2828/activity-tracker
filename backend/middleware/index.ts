import type { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

type JwtPayload = {
  userId: string | number;
  role: "admin" | "user";
};

const isSignedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = Number(decoded.userId);
  if (!Number.isFinite(id)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = {
    userId: decoded.userId,
    role: decoded.role,
    id,
  };
  next();
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports = { isSignedIn, isAdmin };
