import { Router } from "express";
import { createLesson, createQuiz, chat } from "./ai.controller";
import { protect } from "../../Common/middleware/auth";
import { createPersonalizedQuiz } from "./ai.controller";

const router = Router();

router.post("/lesson", protect, createLesson);
router.post("/quiz", protect, createQuiz);
router.post("/chat", protect, chat);
router.get("/personalized-quiz", protect, createPersonalizedQuiz);

export default router;