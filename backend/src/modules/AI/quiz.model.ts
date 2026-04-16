import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 4, "Must have 4 options"],
  },
  answer: {
    type: String,
    required: true,
  },
});

const quizSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
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

    // 🔥 ALL QUESTIONS IN ONE DOCUMENT
    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// 🔥 UNIQUE QUIZ SET
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