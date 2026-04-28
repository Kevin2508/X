import { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth";
import { createTweet, getAllTweets, getSpecificTweet, getUserTweets } from "../controllers/tweetController";
import { upload } from "../services/fileService";
const router = Router();

router.post("/",verifyToken, upload.single('file'), createTweet)
router.get("/", getAllTweets)
router.get("/:id", getSpecificTweet);
router.get("/user/:id",getUserTweets);
export default router;