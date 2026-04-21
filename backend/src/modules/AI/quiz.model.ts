import mongoose, { Schema } from "mongoose";

// 🧩 Question Schema
const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length === 4,
        "Each question must have exactly 4 options",
      ],
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true } // keep question IDs for tracking
);

// 📚 Quiz Schema (ONE DOC PER CONFIG)
const quizSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "grammar",
        "conversation",
        "translation",
        "vocabulary",
        "fill_blank",
      ],
      required: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
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

    // 🔥 ALL QUESTIONS STORED HERE
    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// 🚨 Prevent duplicate quiz sets
quizSchema.index(
  {
    topic: 1,
    type: 1,
    level: 1,
    baseLanguage: 1,
    targetLanguage: 1,
  },
  { unique: true }
);

export default mongoose.model("Quiz", quizSchema);