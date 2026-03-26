import { Request, Response } from "express";
import { generateLesson } from "./generators/lesson.generator";
import { generateQuiz } from "./generators/quiz.generator";
import { chatWithAI } from "./generators/chat.generator";

export const createLesson = async (req: Request, res: Response) => {
  const { topic, level } = req.body;

  const lesson = await generateLesson(topic, level);

  res.json({ lesson });
};

export const createQuiz = async (req: Request, res: Response) => {
  const { topic, level } = req.body;

  const quiz = await generateQuiz(topic, level);

  res.json({ quiz });
};

export const chat = async (req: Request, res: Response) => {
  const { message } = req.body;

  const reply = await chatWithAI(message);

  res.json({ reply });
};