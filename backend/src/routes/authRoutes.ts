import express from "express";
import { signin, signup } from "../controllers/authController";
import { checkDuplicateSignUp } from "../middleware/auth.middleware";
import { verifyCaptcha } from "../middleware/verifyCaptcha";
import { authCaptcha } from "../middleware/captcha";
const router = express.Router();

router.post("/signup",[checkDuplicateSignUp,verifyCaptcha], signup);
router.post("/signin", verifyCaptcha,signin);
router.get('/captcha',authCaptcha);
export default router;