import type { DbSession, User } from "../types";

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user (password stripped). */
      user?: Omit<User, "password">;
      /** DB session row from cookie token lookup — do not use `req.session` (that is express-session). */
      authSession?: DbSession;
    }
  }
}

export {};
