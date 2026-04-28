import { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth";
import { dislikeTweet, likeTweet, retweet } from "../controllers/interactionController";

const router = Router();

router.post("/:tweet_id/like", verifyToken, likeTweet);
router.delete("/:tweet_id/like", verifyToken, dislikeTweet);
router.post("/:tweet_id/retweet", verifyToken, retweet);
export default router;
