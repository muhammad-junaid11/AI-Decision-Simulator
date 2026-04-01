import express from "express";
import { getNextStep } from "../controllers/aiDecisionController.js";

const router = express.Router();

router.post("/ai-decision", getNextStep);

export default router;