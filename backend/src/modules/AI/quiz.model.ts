import mongoose, { Document, Types } from "mongoose";

export interface IQuiz extends Document {
  userId: Types.ObjectId;

  topic: string;
  type: string;
  level: string;

  baseLanguage: string;
  targetLanguage: string;

  questions: {
    question: string;
    options: string[];
    answer: string;
  }[];

  createdAt: Date;
}

const quizSchema = new mongoose.Schema<IQuiz>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    baseLanguage: {
      type: String,
      required: true,
    },

    targetLanguage: {
      type: String,
      required: true,
    },

    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String }],
        answer: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuiz>("Quiz", quizSchema);