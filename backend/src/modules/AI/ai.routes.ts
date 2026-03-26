import { Router } from "express";
import { createLesson, createQuiz, chat } from "./ai.controller";
import { protect } from "../../Common/middleware/auth";

const router = Router();

router.post("/lesson", protect, createLesson);
router.post("/quiz", protect, createQuiz);
router.post("/chat", protect, chat);

export default router;