import { useState } from "react";
import API from "../Common/services/api";
import Navbar from "../Common/components/Navbar";
import BackButton from "../Common/components/BackButton";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Lesson() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("Daily Conversation");
  const [level, setLevel] = useState("Beginner");

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 📚 Generate Lesson
  const generateLesson = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.post("/ai/lesson", {
        topic,
        level,
      });

      setLesson(res.data.lesson);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Failed to generate lesson";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <BackButton />

        <h1 className="text-2xl font-bold">Learn 📚</h1>

        {/* 🔽 Selection */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>Daily Conversation</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Animals</option>
            <option>Past Tense</option>
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
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Generate Lesson 🚀
          </button>
        </div>

        {/* 🔄 Loading */}
        {loading && <p>Generating lesson...</p>}

        {/* ❌ Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* 📚 Lesson Content */}
        {lesson && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-xl shadow space-y-4"
          >
            <h2 className="text-xl font-bold">{lesson.title}</h2>

            <p className="text-gray-700">{lesson.explanation}</p>

            {/* Examples */}
            <div>
              <h3 className="font-semibold">Examples:</h3>
              <ul className="list-disc ml-5">
                {lesson.examples.map((ex: string, i: number) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>

            {/* 🎯 Start Quiz Button */}
            <button
              onClick={() =>
                navigate("/quiz", {
                  state: {
                    topic,
                    level,
                    type: "grammar", // default
                    limit: 5,
                  },
                })
              }
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Practice Quiz 🎮
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
}