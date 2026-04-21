import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Common/components/Navbar";
import BackButton from "../Common/components/BackButton";
import { motion } from "framer-motion";

export default function QuizSetup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    topic: "Daily Conversation",
    type: "conversation",
    level: "Beginner",
    baseLanguage: "Hindi",
    targetLanguage: "English",
    limit: 5,
  });

  const topics = [
    "Daily Conversation",
    "Food",
    "Travel",
    "Shopping",
    "Animals",
    "Past Tense",
  ];

  const types = [
    "grammar",
    "conversation",
    "translation",
    "vocabulary",
    "fill_blank",
  ];

  const startQuiz = () => {
    navigate("/quiz", { state: form });
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <BackButton />

        <h1 className="text-3xl font-bold text-center">
          Start Quiz 🎯
        </h1>

        {/* 🎯 Topic */}
        <div>
          <h2 className="font-semibold mb-2">Choose Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topics.map((t) => (
              <Card
                key={t}
                label={t}
                active={form.topic === t}
                onClick={() => setForm({ ...form, topic: t })}
              />
            ))}
          </div>
        </div>

        {/* 🧠 Type */}
        <div>
          <h2 className="font-semibold mb-2">Quiz Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {types.map((t) => (
              <Card
                key={t}
                label={t}
                active={form.type === t}
                onClick={() => setForm({ ...form, type: t })}
              />
            ))}
          </div>
        </div>

        {/* 🎚️ Level */}
        <div className="grid grid-cols-3 gap-3">
          {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
            <Card
              key={lvl}
              label={lvl}
              active={form.level === lvl}
              onClick={() => setForm({ ...form, level: lvl })}
            />
          ))}
        </div>

        {/* 🌐 Languages */}
        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.baseLanguage}
            onChange={(e) =>
              setForm({ ...form, baseLanguage: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option>Hindi</option>
            <option>English</option>
            <option>Gujarati</option>
          </select>

          <select
            value={form.targetLanguage}
            onChange={(e) =>
              setForm({ ...form, targetLanguage: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Gujarati</option>
          </select>
        </div>

        {/* 🔢 Limit */}
        <div className="flex gap-3 justify-center">
          {[5, 10, 15].map((num) => (
            <Card
              key={num}
              label={`${num} Q`}
              active={form.limit === num}
              onClick={() => setForm({ ...form, limit: num })}
            />
          ))}
        </div>

        {/* 🚀 Start */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={startQuiz}
          className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg hover:bg-blue-700"
        >
          Start Quiz 🚀
        </motion.button>
      </div>
    </>
  );
}

// 🔹 Reusable Card
function Card({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-3 text-center rounded-xl cursor-pointer border transition
        ${
          active
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white hover:bg-blue-50"
        }`}
    >
      {label}
    </motion.div>
  );
}