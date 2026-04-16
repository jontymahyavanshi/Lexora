import { Request, Response } from "express";
import User from "./user.model";
import { generateToken } from "../../Common/utils/jwt";
import Progress from "./progress.model";
// SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    const token = generateToken(user);

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: any = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
// UPDATE LANGUAGE PREFERENCES
export const updateLanguage = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { baseLanguage, targetLanguage } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { baseLanguage, targetLanguage },
      { new: true }
    );

    res.json({
      message: "Language updated",
      baseLanguage: user?.baseLanguage,
      targetLanguage: user?.targetLanguage,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update language" });
  }
};
// 🎯 SUBMIT QUIZ (TRACK ATTEMPTED QUESTIONS)
//
export const submitQuiz = async (req: any, res: Response) => {
  try {
    const { answers } = req.body;
    const userId = req.userId;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Invalid answers data",
      });
    }

    // 🔍 Find user progress
    let progress = await Progress.findOne({ userId });

    // 🆕 Create if not exists
    if (!progress) {
      progress = await Progress.create({ userId });
    }

    // 🧠 Extract question IDs
    const questionIds = answers.map((a: any) =>
      a.questionId.toString()
    );

    // 🔥 Merge without duplicates
    const updatedSet = new Set([
      ...progress.attemptedQuestions,
      ...questionIds,
    ]);

    progress.attemptedQuestions = Array.from(updatedSet);

    // 🚀 OPTIONAL: XP system
    progress.xp += answers.length * 5;

    // 🎯 Level system (simple)
    progress.level = Math.floor(progress.xp / 100) + 1;

    await progress.save();

    res.json({
      message: "Quiz submitted successfully",
      xp: progress.xp,
      level: progress.level,
    });
  } catch (error: any) {
    console.error("SUBMIT QUIZ ERROR:", error.message);

    res.status(500).json({
      message: "Failed to submit quiz",
    });
  }
};