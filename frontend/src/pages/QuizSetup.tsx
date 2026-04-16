import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Common/components/Navbar";
import BackButton from "../Common/components/BackButton";

export default function QuizSetup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    topic: "Daily Conversation",
    type: "conversation",
    level: "Beginner",
    limit: 5,
  });

  const handleChange = (e: any) => {
  const { name, value } = e.target;

  setForm({
    ...form,
    [name]: name === "limit" ? Number(value) : value,
  });
};

  const startQuiz = () => {
    navigate("/quiz", { state: form });
  };

  return (
    <>
    <Navbar />
    <div className="p-6">
      <BackButton />
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96 space-y-4">
        <h2 className="text-xl font-bold text-center">
          Start Quiz 🎯
        </h2>

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

        {/* Limit */}
        <select
          name="limit"
          value={form.limit}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value={5}>5 Questions</option>
          <option value={10}>10 Questions</option>
          <option value={15}>15 Questions</option>
        </select>

        <button
          onClick={startQuiz}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Start Quiz 🚀
        </button>
      </div>
    </div>
    </div>
  </>
  );
}