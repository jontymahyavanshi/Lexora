import { model } from "../ai.service";
import { cleanJSON } from "../../../Common/utils/cleanJson";

export const generateQuiz = async (topic: string, level: string) => {
 const prompt = `
Generate a quiz:
Topic: ${topic}
Level: ${level}

IMPORTANT:
- Return ONLY JSON
- No explanation
- No markdown
- No extra text

Format:
{
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "answer": ""
    }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  const text = response.text();
  return cleanJSON(text);
};