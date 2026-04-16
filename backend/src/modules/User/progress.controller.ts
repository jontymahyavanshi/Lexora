import { Request, Response } from "express";
import Progress from "./progress.model";
import Quiz from "../AI/quiz.model";

export const submitQuiz = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const { quizId, score, total } = req.body;

    // 🧪 Get quiz info
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // 📊 Get or create progress
    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = await Progress.create({ userId });
    }

    // 📊 Save quiz history
    progress.quizHistory.push({
      quizId,
      score,
      total,
      date: new Date(),
    });

    // 🎮 XP calculation
    let xpGained = score * 10;

    // 🔥 Bonus XP based on quiz type
    if (quiz.type === "conversation") xpGained += 20;
    if (quiz.type === "translation") xpGained += 15;
    if (quiz.type === "grammar") xpGained += 10;

    progress.xp += xpGained;

    // 🧠 Level system
    if (progress.xp >= progress.level * 100) {
      progress.level += 1;
    }

    // ⚠️ Weak topics tracking
    if (score < total / 2) {
      progress.weakTopics.push(`${quiz.type}:${quiz.topic}`);
    }

    await progress.save();

    res.json({
      message: "Quiz submitted successfully",
      xpGained,
      totalXP: progress.xp,
      level: progress.level,
      weakTopics: progress.weakTopics,
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting quiz" });
  }
};
export const getDashboard = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const progress = await Progress.findOne({ userId })
      .populate("quizHistory.quizId")
      .lean();

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

    // 📊 Calculate stats
    const totalQuizzes = progress.quizHistory.length;

    const avgScore =
      totalQuizzes === 0
        ? 0
        : progress.quizHistory.reduce(
            (acc: number, q: any) => acc + q.score / q.total,
            0
          ) / totalQuizzes;

    // 🧪 Recent 5 quizzes
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
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};