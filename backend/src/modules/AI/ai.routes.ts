import express from "express";
import {
  createQuiz,
  createLesson,
  createPersonalizedQuiz,
  chat,
} from "./ai.controller";

import { protect } from "../../Common/middleware/auth";

const router = express.Router();

// 🧪 Generate quiz
router.post("/quiz", protect, createQuiz);

// 📚 Generate lesson
router.post("/lesson", protect, createLesson);

// 🧠 Personalized quiz
router.get("/personalized-quiz", protect, createPersonalizedQuiz);

// 💬 Chat
router.post("/chat", protect, chat);

export default router;