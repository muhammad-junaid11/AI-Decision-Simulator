import express from "express";
import { debateController } from "../controllers/debateController.js";

const router = express.Router();

router.post("/debate", debateController);
router.get("/debate-stream", debateController);

export default router;