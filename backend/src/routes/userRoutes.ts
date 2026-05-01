import { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth";
import {
  deleteUser,
  getUser,
  getUserbyId,
  getUserbyUserName,
  updateCoverPic,
  updateProfile,
  updateProfilePic,
} from "../controllers/userController";
import { upload } from "../services/fileService";

const router = Router();
router.get("/me", verifyToken, getUser);
router.get("/:user_id", getUserbyId);
router.get("/username/:user_name", getUserbyUserName);
router.put("/me", verifyToken, updateProfile);
router.put(
  "/me/profile-image",
  verifyToken,
  upload.single("file"),
  updateProfilePic,
);
router.put(
  "/me/cover-image",
  verifyToken,
  upload.single("file"),
  updateCoverPic,
);
router.delete("/me", verifyToken, deleteUser);

export default router;
