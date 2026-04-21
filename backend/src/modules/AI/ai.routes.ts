import express from "express";
import {
  createManualQuiz,
  getQuizFromDB,
} from "./ai.controller";

import { generateLesson } from "./generators/lesson.generator"; // ✅ ADD

import { protect, authorize } from "../../Common/middleware/auth";

const router = express.Router();

//
// 👑 ADMIN
//
router.post(
  "/manual-quiz",
  protect,
  authorize("admin"),
  createManualQuiz
);

//
// 🎮 USER QUIZ
//
router.post("/get-quiz", protect, getQuizFromDB);

//
// 📚 LESSON (FIXED)
//
router.post("/lesson", protect, async (req, res) => {
  try {
    const { topic, level } = req.body;

    const lesson = await generateLesson(topic, level);

    res.json({ lesson });
  } catch (error) {
    res.status(500).json({ message: "Lesson generation failed" });
  }
});

export default router;