import { Request, Response } from "express";
import Quiz from "./quiz.model";
import Progress from "../User/progress.model";

//
// 👑 ADMIN: ADD / MERGE QUESTIONS
//
export const createManualQuiz = async (req: any, res: Response) => {
  try {
    const {
      topic,
      type,
      level,
      baseLanguage,
      targetLanguage,
      questions,
    } = req.body;

    // ✅ Validation
    if (
      !topic ||
      !type ||
      !level ||
      !baseLanguage ||
      !targetLanguage ||
      !questions
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: "Questions must be a non-empty array",
      });
    }

    // 🔍 Find existing quiz set
    let quiz = await Quiz.findOne({
      topic,
      type,
      level,
      baseLanguage,
      targetLanguage,
    });

    if (quiz) {
      // ✅ Append questions
      quiz.questions.push(...questions);
      await quiz.save();

      return res.json({
        message: "Questions added to existing quiz",
        totalQuestions: quiz.questions.length,
      });
    }

    // 🆕 Create new quiz set
    quiz = await Quiz.create({
      topic,
      type,
      level,
      baseLanguage,
      targetLanguage,
      questions,
    });

    res.json({
      message: "New quiz created",
      quiz,
    });
  } catch (error: any) {
    console.error("CREATE QUIZ ERROR:", error.message);

    res.status(500).json({
      message: "Failed to create quiz",
    });
  }
};

//
// 🎮 USER: FETCH QUIZ (SMART)
//
export const getQuizFromDB = async (req: any, res: Response) => {
  try {
    const {
      topic,
      type,
      level,
      baseLanguage,
      targetLanguage,
      limit = 5,
    } = req.body;

    const userId = req.userId;

    const quiz = await Quiz.findOne({
      topic,
      type,
      level,
      baseLanguage,
      targetLanguage,
    });

    if (!quiz || quiz.questions.length === 0) {
      return res.status(404).json({
        message: "No quiz found",
      });
    }

    // 🧠 Get user progress
    const progress = await Progress.findOne({ userId });

    const attempted = progress?.attemptedQuestions || [];

    // 🚫 Remove already attempted
    const freshQuestions = quiz.questions.filter(
      (q: any) => !attempted.includes(q._id.toString())
    );

    // ⚠️ fallback if not enough
    const source =
      freshQuestions.length >= limit ? freshQuestions : quiz.questions;

    // 🎲 Shuffle
    const shuffled = source.sort(() => 0.5 - Math.random());

    const selectedQuestions = shuffled.slice(0, limit);

    res.json({
      message: "Quiz fetched",
      quiz: {
        ...quiz.toObject(),
        questions: selectedQuestions,
      },
    });
  } catch (error: any) {
    console.error("FETCH QUIZ ERROR:", error.message);

    res.status(500).json({
      message: "Failed to fetch quiz",
    });
  }
};