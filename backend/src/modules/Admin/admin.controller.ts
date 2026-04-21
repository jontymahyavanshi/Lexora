import { Request, Response } from "express";
import User from "../User/user.model";
import Quiz from "../AI/quiz.model";
import Progress from "../User/progress.model";

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    // 👥 Total users
    const totalUsers = await User.countDocuments();

    // 📚 Total quiz sets
    const totalQuizzes = await Quiz.countDocuments();

    // 🌍 Total languages (unique target languages)
    const languages = await Quiz.distinct("targetLanguage");

    // 🔥 Active users (users who attempted quiz)
    const activeUsers = await Progress.countDocuments({
      attemptedQuestions: { $exists: true, $not: { $size: 0 } },
    });

    res.json({
      totalUsers,
      totalQuizzes,
      totalLanguages: languages.length,
      activeUsers,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    res.status(500).json({
      message: "Failed to load admin stats",
    });
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to load users" });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};