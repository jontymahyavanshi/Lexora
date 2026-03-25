import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

// 👤 Define User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  xp: number;
  level: number;
  streak: number;
  weakTopics: string[];

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    xp: { type: Number, default: 0 },

    level: { type: Number, default: 1 },

    streak: { type: Number, default: 0 },

    weakTopics: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password
userSchema.pre("save", async function () {
  const user = this as IUser;

  if (!user.isModified("password")) return;

  user.password = await bcrypt.hash(user.password, 10);
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
