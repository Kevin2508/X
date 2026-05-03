import { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getSpecificTweet,
  getUserTweets,
} from "../controllers/tweetController";
import { upload } from "../services/fileService";
const router = Router();

router.post("/",verifyToken, upload.array('files', 5), createTweet)
router.get("/", getAllTweets)
router.get("/user/:id",getUserTweets);
router.get("/:id",verifyToken ,getSpecificTweet);
router.delete("/:id", verifyToken, deleteTweet);
export default router;
