import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../Common/services/api";
import Navbar from "../Common/components/Navbar";
import BackButton from "../Common/components/BackButton";
import { motion } from "framer-motion";
import Toast from "../Common/components/Toast";
import { useToast } from "../Common/hooks/useToast";

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  const quizConfig = location.state;

  const [quiz, setQuiz] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { toast, showToast } = useToast();

  // 🚀 Fetch Quiz
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError("");

      if (!quizConfig) {
        setError("Quiz configuration missing");
        return;
      }

      const res = await API.post("/ai/get-quiz", {
        ...quizConfig,
        baseLanguage: "Hindi",
        targetLanguage: "English",
      });

      setQuiz(res.data.quiz);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  // 🔄 Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading quiz...
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-3">{error}</p>
        <button
          onClick={fetchQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!quiz) return null;

  const question = quiz.questions[current];

  // 🎯 Select
  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
  };

  // 🧠 Check
  const handleCheck = () => {
    if (!selected) return;

    const correct = selected === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  // ➡️ Next
  const handleNext = () => {
    const updatedAnswers = [
      ...answers,
      { questionId: question._id, selected },
    ];

    setAnswers(updatedAnswers);
    setSelected(null);
    setShowResult(false);
    setIsCorrect(null);

    if (current < quiz.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      submitQuiz(updatedAnswers);
    }
  };

  // 🚀 Submit (UPDATED 🔥)
  const submitQuiz = async (finalAnswers: any[]) => {
    try {
      let score = 0;

      quiz.questions.forEach((q: any, i: number) => {
        if (finalAnswers[i].selected === q.answer) {
          score++;
        }
      });

      const res = await API.post("/user/submit-quiz", {
        quizId: quiz._id,
        answers: finalAnswers,
      });

      // 🎉 TOAST (instead of alert)
      showToast(
        `🎉 ${score}/${quiz.questions.length} | +${res.data.xpGained} XP`,
        "success"
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Failed to submit quiz",
        "error"
      );
    }
  };

  return (
    <>
      <Navbar />

      {/* 🔔 Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="p-6 max-w-xl mx-auto space-y-6">
        <BackButton />

        {/* 📊 Progress */}
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-blue-600 h-2 rounded transition-all"
            style={{
              width: `${((current + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>

        {/* ❓ Question */}
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-5 rounded-xl shadow"
        >
          <h2 className="text-lg font-semibold">
            {question.question}
          </h2>
        </motion.div>

        {/* 🧩 Options */}
        <div className="space-y-3">
          {question.options.map((opt: string, i: number) => {
            let style =
              "bg-white hover:bg-gray-100 border-gray-300";

            if (showResult) {
              if (opt === question.answer) {
                style = "bg-green-200 border-green-500";
              } else if (opt === selected) {
                style = "bg-red-200 border-red-500";
              }
            } else if (selected === opt) {
              style = "bg-blue-100 border-blue-500";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                className={`w-full p-3 border rounded-lg text-left transition ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* 🎯 Result */}
        {showResult && (
          <p
            className={`text-center font-bold ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "Correct! 🎉" : "Wrong ❌"}
          </p>
        )}

        {/* 🔘 Buttons */}
        {!showResult ? (
          <button
            onClick={handleCheck}
            disabled={!selected}
            className="w-full bg-blue-600 text-white p-3 rounded disabled:bg-gray-400"
          >
            Check
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-green-600 text-white p-3 rounded"
          >
            Next
          </button>
        )}
      </div>
    </>
  );
}