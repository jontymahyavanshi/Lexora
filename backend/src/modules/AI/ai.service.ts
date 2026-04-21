import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ⚡ Fast + cheap model (best for your use case)
export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});