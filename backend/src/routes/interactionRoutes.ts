import { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth";
import {
  comment,
  deleteComment,
  deleteRetweet,
  dislikeTweet,
  getComment,
  likeTweet,
  retweet,
} from "../controllers/interactionController";

const router = Router();

router.post("/:tweet_id/like", verifyToken, likeTweet);
router.delete("/:tweet_id/like", verifyToken, dislikeTweet);
router.post("/:tweet_id/retweet", verifyToken, retweet);
router.delete("/:tweet_id/retweet", verifyToken, deleteRetweet);
router.post("/:tweet_id/comment", verifyToken, comment);
router.get("/:tweet_id/comment", getComment);
router.delete("/:comment_id", verifyToken, deleteComment);
export default router;
