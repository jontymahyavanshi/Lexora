export const cleanJSON = (text: string) => {
  try {
    // remove ```json ``` blocks
    let cleaned = text.replace(/```json|```/g, "").trim();

    // extract JSON part only
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }

    return JSON.parse(cleaned);
  } catch (error) {
    return {
      error: "Invalid JSON from AI",
      raw: text,
    };
  }
};
export const sanitizeQuestions = (questions: any[]) => {
  return questions.map((q) => {
    let question = q.question;

    // ❌ remove unwanted phrases
    question = question.replace(/Choose the correct.*?:/gi, "");
    question = question.replace(/Translate.*?:/gi, "");
    question = question.replace(/Select the correct.*?:/gi, "");

    return {
      ...q,
      question: question.trim(),
    };
  });
};