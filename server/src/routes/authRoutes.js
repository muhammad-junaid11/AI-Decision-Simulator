import express from "express";
import { registerUser, loginUser, getMe,refreshToken  } from "../controllers/authController.js"; 

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getMe);
router.post("/refresh", refreshToken);

export default router;