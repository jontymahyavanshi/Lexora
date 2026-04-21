import { Response } from "express";
import Progress from "./progress.model";
import Quiz from "../AI/quiz.model";

//
// 🎯 SUBMIT QUIZ
//
export const submitQuiz = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { answers, quizId } = req.body;

    // ❌ Validation
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Invalid answers data",
      });
    }

    // 🧪 Get quiz
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    // 📊 Get or create progress
    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = await Progress.create({ userId });
    }

    // 🎯 Calculate score
    let score = 0;

    quiz.questions.forEach((q: any) => {
      const userAnswer = answers.find(
        (a: any) => a.questionId === q._id.toString()
      );

      if (userAnswer && userAnswer.selected === q.answer) {
        score++;
      }
    });

    const total = quiz.questions.length;

    // 📊 Save history
    progress.quizHistory.push({
      quizId,
      score,
      total,
      date: new Date(),
    });

    // 🚫 Track attempted questions
    const questionIds = answers.map((a: any) =>
      a.questionId.toString()
    );

    const updatedSet = new Set([
      ...progress.attemptedQuestions,
      ...questionIds,
    ]);

    progress.attemptedQuestions = Array.from(updatedSet);

    // 🎮 XP SYSTEM
    let xpGained = score * 10;

    if (quiz.type === "conversation") xpGained += 20;
    if (quiz.type === "translation") xpGained += 15;
    if (quiz.type === "grammar") xpGained += 10;

    progress.xp += xpGained;

    // 📈 LEVEL SYSTEM
    if (progress.xp >= progress.level * 100) {
      progress.level += 1;
    }

    // 🔥 WEAK TOPIC LOGIC (FIXED)
    const accuracy = score / total;
    const weakKey = `${quiz.type}:${quiz.topic}`;

    if (accuracy < 0.6) {
      if (!progress.weakTopics.includes(weakKey)) {
        progress.weakTopics.push(weakKey);
      }
    } else {
      // ✅ Remove if user improved
      progress.weakTopics = progress.weakTopics.filter(
        (t) => t !== weakKey
      );
    }

    // 🔥 STREAK SYSTEM
    const today = new Date();
    const lastPlayed = progress.lastPlayed
      ? new Date(progress.lastPlayed)
      : null;

    const todayStr = today.toDateString();
    const lastStr = lastPlayed?.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (!lastPlayed) {
      progress.streak = 1;
    } else if (todayStr === lastStr) {
      // same day → no change
    } else if (lastStr === yesterdayStr) {
      progress.streak += 1;
    } else {
      progress.streak = 1;
    }

    progress.lastPlayed = new Date();

    await progress.save();

    res.json({
      message: "Quiz submitted successfully",
      score,
      total,
      xpGained,
      totalXP: progress.xp,
      level: progress.level,
      streak: progress.streak,
      weakTopics: progress.weakTopics,
    });
  } catch (error: any) {
    console.error("SUBMIT ERROR:", error.message);

    res.status(500).json({
      message: "Error submitting quiz",
    });
  }
};

//
// 📊 DASHBOARD DATA
//
export const getDashboard = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const progress = await Progress.findOne({ userId })
      .populate("quizHistory.quizId")
      .lean();

    // 🆕 NEW USER
    if (!progress) {
      return res.json({
        xp: 0,
        level: 1,
        streak: 0,
        weakTopics: [],
        stats: {
          totalQuizzes: 0,
          averageScore: 0,
        },
        recentQuizzes: [],
        isNewUser: true,
      });
    }

    const totalQuizzes = progress.quizHistory.length;

    const avgScore =
      totalQuizzes === 0
        ? 0
        : progress.quizHistory.reduce(
            (acc: number, q: any) => acc + q.score / q.total,
            0
          ) / totalQuizzes;

    const recentQuizzes = progress.quizHistory
      .slice(-5)
      .reverse()
      .map((q: any) => ({
        topic: q.quizId?.topic,
        type: q.quizId?.type,
        score: q.score,
        total: q.total,
        date: q.date,
      }));

    res.json({
      xp: progress.xp,
      level: progress.level,
      streak: progress.streak,
      weakTopics: progress.weakTopics,

      stats: {
        totalQuizzes,
        averageScore: Number((avgScore * 100).toFixed(2)),
      },

      recentQuizzes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
};