import { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth";
import { checkFollowing, followUser, getFollowers, getFollowing, unfollowUser } from "../controllers/followController";

const router = Router();

router.post("/:followee_id",verifyToken,followUser);
router.delete("/:followee_id",verifyToken,unfollowUser);
router.get("/:user_id/followers",getFollowers);
router.get("/:user_id/following",getFollowing);
router.get("/check/:followee_id",verifyToken,checkFollowing);

export default router;