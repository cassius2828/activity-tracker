import { Router } from "express";
import { login, register, logout, getSession } from "../controllers/auth";
import { isSignedIn } from "../middleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/session", isSignedIn, getSession);

export default router;
