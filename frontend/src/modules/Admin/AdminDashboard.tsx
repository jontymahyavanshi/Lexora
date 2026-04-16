import { useState } from "react";
import API from "../../Common/services/api";
import Navbar from "../../Common/components/Navbar";
import BackButton from "../../Common/components/BackButton";

export default function AdminDashboard() {
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

  // 🧠 Handle dropdowns
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 👀 Preview JSON
  const handlePreview = () => {
    try {
      const parsed = JSON.parse(form.json);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        setMessage("❌ JSON must contain 'questions' array");
        return;
      }

      setPreview(parsed.questions);
      setMessage("✅ Preview loaded");
    } catch {
      setMessage("❌ Invalid JSON format");
    }
  };

  // 🚀 Submit quiz
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const parsed = JSON.parse(form.json);

      const res = await API.post("/ai/manual-quiz", {
        topic: form.topic,
        type: form.type,
        level: form.level,
        baseLanguage: form.baseLanguage,
        targetLanguage: form.targetLanguage,
        questions: parsed.questions,
      });

      setMessage(res.data.message || "✅ Quiz saved!");
      setPreview([]);
      setForm({ ...form, json: "" });
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "❌ Failed to add quiz";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto space-y-5">
        <BackButton />

        <h1 className="text-2xl font-bold">Admin Panel 👑</h1>

        {/* 🔽 Dropdowns */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          {/* Topic */}
          <select
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option>Daily Conversation</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Animals</option>
            <option>Past Tense</option>
          </select>

          {/* Type */}
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="grammar">Grammar</option>
            <option value="conversation">Conversation</option>
            <option value="translation">Translation</option>
            <option value="vocabulary">Vocabulary</option>
            <option value="fill_blank">Fill Blank</option>
          </select>

          {/* Level */}
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          {/* 🌐 Base Language */}
          <select
            name="baseLanguage"
            value={form.baseLanguage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option>Hindi</option>
            <option>English</option>
            <option>Gujarati</option>
          </select>

          {/* 🎯 Target Language */}
          <select
            name="targetLanguage"
            value={form.targetLanguage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Gujarati</option>
          </select>
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
            className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
          >
            Preview 👀
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Add Quiz 🚀"}
          </button>
        </div>

        {/* 💬 Message */}
        {message && (
          <p className="text-center font-medium">{message}</p>
        )}

        {/* 👀 Preview */}
        {preview.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow space-y-3">
            <h2 className="font-bold text-lg">Preview</h2>

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