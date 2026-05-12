import { Router } from "express";
import { getUserById, getUsers } from "../controllers/users";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getUserById);

export default router;
