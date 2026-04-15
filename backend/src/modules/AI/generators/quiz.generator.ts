import { model } from "../ai.service";
import { cleanJSON } from "../../../Common/utils/cleanJson";
import { sanitizeQuestions } from "../../../Common/utils/cleanJson";

type QuizType =
  | "grammar"
  | "conversation"
  | "translation"
  | "vocabulary"
  | "fill_blank";

export const generateQuiz = async (
  topic: string,
  level: string,
  type: QuizType,
  baseLang: string,
  targetLang: string,
  limit: number = 5
) => {
  let instruction = "";

  switch (type) {
    case "grammar":
      instruction =
        "Create grammar-based questions focusing on correct sentence structure.";
      break;

    case "conversation":
      instruction =
        "Simulate real-life conversations and ask questions based on dialogue.";
      break;

    case "translation":
      instruction = `Create translation questions from ${baseLang} to ${targetLang}.`;
      break;

    case "vocabulary":
      instruction = "Test vocabulary knowledge using meanings and word usage.";
      break;

    case "fill_blank":
      instruction = "Create fill-in-the-blank questions with one blank.";
      break;

    default:
      instruction = "Create mixed language learning questions.";
  }

  const prompt = `
You are a strict AI language learning system like Duolingo.

Target Language: ${targetLang}
Base Language: ${baseLang}

Quiz Type: ${type}
Topic: ${topic}
Level: ${level}

CRITICAL RULES (MUST FOLLOW):

1. Language Rules:
- Questions MUST be in ${targetLang}
- Options MUST be in ${targetLang}
- ONLY translation source text can be in ${baseLang}
- DO NOT use ${baseLang} in questions unless translation type

2. No Extra Text:
- DO NOT add phrases like:
  "Choose the correct..."
  "Translate the following..."
- ONLY return direct question

3. Strict Question Type:
- grammar → sentence correctness only
- conversation → real-life reply
- translation → only translate short phrases
- vocabulary → ONLY word meaning or usage
- fill_blank → one blank only

4. Output Rules:
- EXACTLY ${limit} questions
- Each question SHORT (1 line)
- No repetition
- No explanation
- No markdown
- Return ONLY JSON

FORMAT:
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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text();

// console.log("RAW AI RESPONSE:\n", text);
    // ✅ STEP 1: Parse JSON
    const cleaned = cleanJSON(text);

    // ✅ STEP 2: Remove unwanted phrases
    if (cleaned.questions) {
      cleaned.questions = sanitizeQuestions(cleaned.questions);
    }

    // ✅ STEP 3: Type-based fix (important)
    if (type === "vocabulary" && cleaned.questions) {
      cleaned.questions = cleaned.questions.map((q: any) => ({
        ...q,
        question: q.question
          .replace(/Translate.*?:/gi, "")
          .replace(/Choose.*?:/gi, "")
          .trim(),
      }));
    }

    return cleaned;
  } catch (error) {
    return {
      error: "AI quiz generation failed",
    };
  }
};