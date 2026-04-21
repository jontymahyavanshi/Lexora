import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    // 🔥 STREAK SYSTEM
    streak: {
      type: Number,
      default: 0,
    },

    lastPlayed: {
      type: Date,
      default: null,
    },

    weakTopics: {
      type: [String],
      default: [],
    },

    // 📊 QUIZ HISTORY
    quizHistory: [
      {
        quizId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Quiz",
        },
        score: Number,
        total: Number,
        date: Date,
      },
    ],

    // 🚫 NO REPEAT QUESTIONS
    attemptedQuestions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);