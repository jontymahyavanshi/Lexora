import { useState } from "react";
import API from "../../Common/services/api";
import Navbar from "../../Common/components/Navbar";
import BackButton from "../../Common/components/BackButton";
import { motion } from "framer-motion";

export default function AdminQuizManager() {
  const [form, setForm] = useState({
    topic: "Daily Conversation",
    type: "conversation",
    level: "Beginner",
    baseLanguage: "Hindi",
    targetLanguage: "English",
    json: "",
  });

  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 👀 Preview
  const handlePreview = () => {
    try {
      const parsed = JSON.parse(form.json);

      if (!parsed.questions) {
        setMessage("❌ JSON must contain 'questions'");
        return;
      }

      setPreview(parsed.questions);
      setMessage("✅ Preview loaded");
    } catch {
      setMessage("❌ Invalid JSON format");
    }
  };

  // 🚀 Submit
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const parsed = JSON.parse(form.json);

      await API.post("/ai/manual-quiz", {
        topic: form.topic,
        type: form.type,
        level: form.level,
        baseLanguage: form.baseLanguage,
        targetLanguage: form.targetLanguage,
        questions: parsed.questions,
      });

      setMessage("✅ Quiz added successfully!");
      setPreview([]);
      setForm({ ...form, json: "" });
    } catch (err: any) {
      setMessage(
        err.response?.data?.message || "❌ Failed to add quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <BackButton />

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold"
        >
          Quiz Manager 🎯
        </motion.h1>

        {/* 🎯 FORM (SAME AS YOUR UI) */}
        <div className="bg-white p-5 rounded-xl shadow space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select
              name="topic"
              value={form.topic}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option>Daily Conversation</option>
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Animals</option>
              <option>Past Tense</option>
            </select>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="grammar">Grammar</option>
              <option value="conversation">Conversation</option>
              <option value="translation">Translation</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="fill_blank">Fill Blank</option>
            </select>

            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <input
              name="baseLanguage"
              value={form.baseLanguage}
              onChange={handleChange}
              placeholder="Base Language"
              className="p-2 border rounded"
            />

            <input
              name="targetLanguage"
              value={form.targetLanguage}
              onChange={handleChange}
              placeholder="Target Language"
              className="p-2 border rounded col-span-2"
            />
          </div>
        </div>

        {/* 🧾 JSON INPUT */}
        <textarea
          placeholder="Paste quiz JSON here..."
          value={form.json}
          onChange={(e) =>
            setForm({ ...form, json: e.target.value })
          }
          className="w-full h-40 p-3 border rounded"
        />

        {/* 🎯 Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            className="flex-1 bg-gray-600 text-white p-2 rounded"
          >
            Preview 👀
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "Uploading..." : "Add Quiz 🚀"}
          </button>
        </div>

        {/* 💬 Message */}
        {message && <p className="text-center">{message}</p>}

        {/* 👀 Preview */}
        {preview.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow space-y-3">
            <h2 className="font-bold">Preview</h2>

            {preview.map((q, i) => (
              <div key={i} className="border p-3 rounded">
                <p className="font-semibold">
                  {i + 1}. {q.question}
                </p>

                <ul className="list-disc ml-5">
                  {q.options.map((opt: string, j: number) => (
                    <li key={j}>{opt}</li>
                  ))}
                </ul>

                <p className="text-green-600">
                  Answer: {q.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}