import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-100 to-blue-200 text-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-4"
      >
        Welcome to Lexora 🌍
      </motion.h1>

      <p className="text-gray-700 mb-6 max-w-md">
        Learn languages with AI-powered quizzes, lessons, and real-time practice.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="bg-white border px-5 py-2 rounded-lg hover:bg-gray-100"
        >
          Register
        </button>
      </div>
    </div>
  );
}