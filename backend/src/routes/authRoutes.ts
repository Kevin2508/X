import express from "express";
import { signin, signup } from "../controllers/authController";
import { checkDuplicateSignUp } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/signup",checkDuplicateSignUp, signup);
router.post("/signin", signin);

export default router;