import { Request, Response } from "express";
import User from "./user.model";
import { generateToken } from "../../Common/utils/jwt";

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