import { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth";
import { getUser } from "../controllers/userController";

const router = Router();
router.get("/me", verifyToken,getUser);

export default router;
