import { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth";
import { createTweet, getAllTweets, getSpecificTweet, getUserTweets } from "../controllers/tweetController";
import { upload } from "../services/fileService";
const router = Router();

router.post("/",verifyToken, upload.single('file'), createTweet)
router.get("/", getAllTweets)
router.get("/:id",verifyToken ,getSpecificTweet);
router.get("/user/:id",getUserTweets);
export default router;