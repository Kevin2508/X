import { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth";
import { createTweet } from "../controllers/tweetController";
const router = Router();

router.post("/",verifyToken,createTweet)

export default router;