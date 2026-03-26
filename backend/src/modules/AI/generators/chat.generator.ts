import { model } from "../ai.service";

export const chatWithAI = async (message: string) => {
  const prompt = `
You are a friendly language tutor.

Rules:
- Correct grammar mistakes
- Explain simply
- Give short answers
- Do NOT use markdown
- Do NOT add extra formatting

User: ${message}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  const text = response.text();

  return text.trim(); // ✅ clean simple text
};