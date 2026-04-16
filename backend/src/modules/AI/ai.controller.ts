import { Request, Response } from "express";
import { generateLesson } from "./generators/lesson.generator";
import { generateQuiz } from "./generators/quiz.generator";
import { chatWithAI } from "./generators/chat.generator";

import Progress from "../User/progress.model";
import User from "../User/user.model";
import Quiz from "./quiz.model";

// 📚 LESSON
export const createLesson = async (req: any, res: Response) => {
  try {
    const { topic, level } = req.body;

    if (!topic || !level) {
      return res.status(400).json({ message: "Missing topic or level" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lesson = await generateLesson(topic, level);

    res.json({ lesson });
  } catch (error: any) {
    console.error("LESSON ERROR:", error.message);

    res.status(500).json({
      message: "Lesson generation failed",
      error: error.message,
    });
  }
};

// 🧠 PERSONALIZED QUIZ
export const createPersonalizedQuiz = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const progress = await Progress.findOne({ userId });

    if (!progress || progress.weakTopics.length === 0) {
      return res.json({
        message: "No weak topics yet",
      });
    }

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
      return res.status(500).json({
        message: "AI returned invalid quiz",
        debug: quizData,
      });
    }

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
  } catch (error: any) {
    console.error("PERSONALIZED QUIZ ERROR:", error.message);

    res.status(500).json({
      message: "Personalized quiz failed",
      error: error.message,
    });
  }
};

// 🧪 NORMAL QUIZ (MOST IMPORTANT)
export const createQuiz = async (req: any, res: Response) => {
  try {
    const { topic, level, type, limit } = req.body;

    console.log("REQ BODY:", req.body); // 🔥 debug

    // ✅ Validate input
    if (!topic || !level || !type) {
      return res.status(400).json({
        message: "Missing required fields (topic, level, type)",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);

    // 🤖 Generate quiz
    const quizData = await generateQuiz(
      topic,
      level,
      type,
      user.baseLanguage,
      user.targetLanguage,
      safeLimit
    );

    // 🚨 AI FAIL SAFE
   if (!quizData || quizData.error) {
    console.error("AI FAILED RESPONSE:", quizData);
  return res.status(500).json({
    message: quizData?.error || "AI failed",
  });
}

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
  } catch (error: any) {
    console.error("QUIZ ERROR:", error);

    res.status(500).json({
      message: "Quiz generation failed",
      error: error.message,
    });
  }
};

// 💬 CHAT
export const chat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = await chatWithAI(message);

    res.json({ reply });
  } catch (error: any) {
    console.error("CHAT ERROR:", error.message);

    res.status(500).json({
      message: "Chat failed",
      error: error.message,
    });
  }
};