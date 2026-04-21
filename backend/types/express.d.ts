import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      userId: string | number;
      role: "admin" | "user";
    };
  }
}

export {};
