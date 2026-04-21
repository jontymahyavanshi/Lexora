export const cleanJSON = (text: string) => {
  try {
    // ❌ remove markdown
    let cleaned = text.replace(/```json|```/g, "").trim();

    // 🎯 extract JSON only
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("JSON PARSE ERROR:", error);

    return {
      error: "Invalid JSON from AI",
      raw: text,
    };
  }
};

// 🧹 Remove unwanted phrases
export const sanitizeQuestions = (questions: any[]) => {
  return questions.map((q) => {
    let question = q.question;

    question = question.replace(/Choose.*?:/gi, "");
    question = question.replace(/Translate.*?:/gi, "");
    question = question.replace(/Select.*?:/gi, "");

    return {
      ...q,
      question: question.trim(),
    };
  });
};