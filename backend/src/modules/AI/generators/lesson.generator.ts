import { model } from "../ai.service";
import { cleanJSON } from "../../../Common/utils/cleanJson";

export const generateLesson = async (topic: string, level: string) => {
  const prompt = `
You are a friendly English teacher.

Topic: ${topic}
Level: ${level}

RULES:
- Give a LONG explanation (8–12 lines)
- Use VERY simple English
- Explain step-by-step
- Avoid complex grammar terms
- Make it easy for beginners
- Add real-life examples
- Keep it readable (like a blog)

Return ONLY JSON:

{
  "title": "",
  "explanation": "",
  "examples": ["", "", "", "", ""]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return cleanJSON(text);
  } catch {
    return {
      title: topic,
      explanation: "Lesson generation failed",
      examples: [],
    };
  }
};