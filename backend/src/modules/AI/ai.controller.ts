import { Request, Response } from "express";
import { generateLesson } from "./generators/lesson.generator";
import { generateQuiz } from "./generators/quiz.generator";
import { chatWithAI } from "./generators/chat.generator";

import Progress from "../User/progress.model"; // ✅ FIXED
import User from "../User/user.model";
import Quiz from "./quiz.model";

// 📚 LESSON
export const createLesson = async (req: any, res: Response) => {
  try {
    const { topic, level } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lesson = await generateLesson(topic, level);

    res.json({ lesson });
  } catch (error) {
    res.status(500).json({ message: "Lesson generation failed" });
  }
};

// 🧠 PERSONALIZED QUIZ
export const createPersonalizedQuiz = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const progress = await Progress.findOne({ userId });

    if (!progress) {
      return res.status(404).json({ message: "No progress found" });
    }

    if (progress.weakTopics.length === 0) {
      return res.json({
        message: "No weak topics yet, try normal quiz",
      });
    }

    // 🎯 Pick random weak topic
    const randomWeak =
      progress.weakTopics[
        Math.floor(Math.random() * progress.weakTopics.length)
      ];

    const [type, topic] = randomWeak.split(":");

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const quizData = await generateQuiz(
      topic,
      "Beginner",
      type as any,
      user.baseLanguage,
      user.targetLanguage,
      5
    );

    if (!quizData || !quizData.questions) {
      return res.status(500).json({ message: "Invalid quiz generated" });
    }

    // 💾 Save quiz
    const quiz = await Quiz.create({
      userId,
      topic,
      type,
      level: "Beginner",
      baseLanguage: user.baseLanguage,
      targetLanguage: user.targetLanguage,
      questions: quizData.questions,
    });

    res.json({
      message: "Personalized quiz generated",
      focus: randomWeak,
      quiz,
    });
  } catch (error) {
    res.status(500).json({ message: "Personalized quiz failed" });
  }
};

// 🧪 NORMAL QUIZ
export const createQuiz = async (req: any, res: Response) => {
  try {
    const { topic, level, type, limit } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🛡️ Safe limit (1–20)
    const safeLimit = Math.min(Math.max(limit || 5, 1), 20);

    // 🤖 Generate quiz
    const quizData = await generateQuiz(
      topic,
      level,
      type,
      user.baseLanguage,
      user.targetLanguage,
      safeLimit
    );

    if (!quizData || !quizData.questions) {
      return res.status(500).json({ message: "Invalid quiz generated" });
    }

    // 💾 Save quiz
    const quiz = await Quiz.create({
      userId: user._id,
      topic,
      type,
      level,
      baseLanguage: user.baseLanguage,
      targetLanguage: user.targetLanguage,
      questions: quizData.questions,
    });

    res.json({
      message: "Quiz generated successfully",
      totalQuestions: quiz.questions.length,
      quiz,
    });
  } catch (error) {
    res.status(500).json({ message: "Quiz generation failed" });
  }
};

// 💬 CHAT
export const chat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const reply = await chatWithAI(message);

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: "Chat failed" });
  }
};