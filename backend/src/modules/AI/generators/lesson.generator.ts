import { model } from "../ai.service";
import { cleanJSON } from "../../../Common/utils/cleanJson";

export const generateLesson = async (topic: string, level: string) => {
const prompt = `
You are a language teacher.

Create a lesson:
Topic: ${topic}
Level: ${level}

IMPORTANT:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text

Format:
{
  "title": "",
  "explanation": "",
  "examples": []
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  const text = response.text();
  return cleanJSON(text);
};