const db = require("../config/db");
const { users } = require("../config/schema");
const {
  Request,
  Response,
  NextFunction,
} = require("express");
const jwt = require("jsonwebtoken");
type JWTUser = {
    userId: string;
    role: "admin" | "user";
}

type AuthenticationRequest = Request & {
    user?: JWTUser;
}


const isSignedIn = ( req: Request, res: Response, next: typeof NextFunction) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTUser;
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  (req as AuthenticationRequest).user = decoded;
  next();
};

const isAdmin = async ( req: Request, res: Response, next: typeof NextFunction) => {
    const user = await db.select("role").from(users).where(users.id === req.user?.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports = { isSignedIn, isAdmin };
