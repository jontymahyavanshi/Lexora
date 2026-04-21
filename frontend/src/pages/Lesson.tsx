import { useState } from "react";
import API from "../Common/services/api";
import Navbar from "../Common/components/Navbar";
import BackButton from "../Common/components/BackButton";
import Loader from "../Common/components/Loader";
import Error from "../Common/components/Error";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Lesson() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("Daily Conversation");
  const [level, setLevel] = useState("Beginner");

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateLesson = async () => {
    try {
      setLoading(true);
      setError("");
      setLesson(null);

      const res = await API.post("/ai/lesson", {
        topic,
        level,
      });

      setLesson(res.data.lesson);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to generate lesson"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <BackButton />

        <h1 className="text-3xl font-bold text-center">
          Learn 📚
        </h1>

        {/* 🎯 Controls */}
        <div className="bg-white p-5 rounded-2xl shadow space-y-3">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>Present Simple</option>
            <option>Present Continuous</option>
            <option>Past Simple</option>
            <option>Past Continuous</option>
            <option>Future Simple</option>
            <option>Present Perfect</option>
            <option>Past Perfect</option>
            <option>Future Perfect</option>
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <button
            onClick={generateLesson}
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Generate Lesson 🚀
          </button>
        </div>

        {/* 🔄 Loading */}
        {loading && <Loader text="Generating lesson..." />}

        {/* ❌ Error */}
        {error && <Error message={error} />}

        {/* 📚 Lesson */}
        {lesson && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl shadow space-y-6 leading-relaxed"
  >
    {/* 📚 Title */}
    <h2 className="text-2xl font-bold text-blue-600">
      {lesson.title}
    </h2>

    {/* 📖 Explanation */}
    <p className="text-gray-700 whitespace-pre-line">
      {lesson.explanation}
    </p>

    {/* ✨ Divider */}
    <div className="border-t pt-4">
      <h3 className="font-semibold text-lg mb-2">
        Examples:
      </h3>

      <ul className="space-y-2">
        {lesson.examples.map((ex: string, i: number) => (
          <li
            key={i}
            className="bg-gray-100 p-3 rounded-lg"
          >
            {ex}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
)}
      </div>
    </>
  );
}