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