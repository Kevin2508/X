import express from "express";
import {
  requestPasswordReset,
  resetPasswordWithOtp,
  signin,
  signup,
} from "../controllers/authController";
import { checkDuplicateSignUp } from "../middleware/auth.middleware";
import { verifyCaptcha } from "../middleware/verifyCaptcha";
import { authCaptcha } from "../middleware/captcha";
const router = express.Router();

router.post("/signup",[checkDuplicateSignUp,verifyCaptcha], signup);
router.post("/signin",signin);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPasswordWithOtp);
router.get('/captcha',authCaptcha);
export default router;
