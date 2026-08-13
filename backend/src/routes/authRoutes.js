import express from "express";
import { registerUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";
import { getMe, 
    updateMe, uploadAvatar,
 } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import avatarUpload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/me/avatar", protect, avatarUpload.single("avatar"), uploadAvatar);
router.post("/login", loginUser);

export default router;