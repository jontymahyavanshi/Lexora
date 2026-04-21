import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

// 👤 Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";

  baseLanguage: string;
  targetLanguage: string;

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 🌍 Language settings
    baseLanguage: {
      type: String,
      default: "Hindi",
    },

    targetLanguage: {
      type: String,
      default: "English",
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password before save
userSchema.pre("save", async function () {
  const user = this as IUser;

  if (!user.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", userSchema);