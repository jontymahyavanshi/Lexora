import mongoose, { Document, Types } from "mongoose";

export interface IProgress extends Document {
  userId: Types.ObjectId;

  xp: number;
  level: number;
  streak: number;

  weakTopics: string[];

  quizHistory: {
    quizId: Types.ObjectId;
    score: number;
    total: number;
    date: Date;
  }[];
}

const progressSchema = new mongoose.Schema<IProgress>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one progress per user
    },

    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    streak: {
      type: Number,
      default: 0,
    },

    weakTopics: {
      type: [String],
      default: [],
    },

    quizHistory: [
      {
        quizId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Quiz",
        },
        score: Number,
        total: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProgress>("Progress", progressSchema);