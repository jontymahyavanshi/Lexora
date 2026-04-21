import { Request, Response } from "express";
import User from "./user.model";
import { generateToken } from "../../Common/utils/jwt";

// 📝 SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // ❌ Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ✅ Create user
    const user = await User.create({ name, email, password });

    // 🔐 Generate token
    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    // ❌ Remove password
    const userObj = user.toObject();
    delete (userObj as any).password;

    res.status(201).json({
      message: "User created",
      user: userObj,
      token,
    });
  } catch (error: any) {
    console.error("SIGNUP ERROR:", error.message);

    res.status(500).json({
      message: "Signup failed",
    });
  }
};

// 🔐 LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: any = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // 🔐 Token
    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    // ❌ Remove password
    const userObj = user.toObject();
    delete (userObj as any).password;

    res.json({
      message: "Login successful",
      user: userObj,
      token,
    });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error.message);

    res.status(500).json({
      message: "Login failed",
    });
  }
};

// 🌍 UPDATE LANGUAGE
export const updateLanguage = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { baseLanguage, targetLanguage } = req.body;

    if (!baseLanguage || !targetLanguage) {
      return res.status(400).json({
        message: "Both languages are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { baseLanguage, targetLanguage },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Language updated",
      baseLanguage: user.baseLanguage,
      targetLanguage: user.targetLanguage,
    });
  } catch (error: any) {
    console.error("LANGUAGE UPDATE ERROR:", error.message);

    res.status(500).json({
      message: "Failed to update language",
    });
  }
};