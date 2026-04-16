import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../Common/services/api";
import Navbar from "../Common/components/Navbar";
import BackButton from "../Common/components/BackButton";

export default function Quiz() {
  const location = useLocation();
  const quizConfig = location.state; // ✅ data from QuizSetup

  const [quiz, setQuiz] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // 🔥 Fetch quiz (DYNAMIC)
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError("");

      if (!quizConfig) {
        setError("Quiz configuration missing");
        return;
      }

      const res = await API.post("/ai/quiz", quizConfig);

      setQuiz(res.data.quiz);
    } catch (err: any) {
       const msg =
       err.response?.data?.message ||
       "Failed to load quiz";

       setError(msg);
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
      <>
      <Navbar />
     <div className="p-6"> 
      <div className="flex justify-center items-center h-screen">
        Loading quiz...
      </div>
      </div>
      </>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <>
      <Navbar />
      <BackButton />
      <div className="p-6">
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
      </div>
      </>
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

  // 🚀 Submit
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
        score,
        total: quiz.questions.length,
      });

      alert(`🎉 Score: ${score}/${quiz.questions.length}
XP Gained: ${res.data.xpGained}`);

      window.location.href = "/dashboard";
    } catch {
      alert("Error submitting quiz");
    }
  };
console.log("Quiz Config:", quizConfig);
  return (
    <>
    <Navbar />
    <div className="p-6 space-y-6">
      <BackButton />
    <div className="p-6 max-w-xl mx-auto space-y-6">
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
      <h2 className="text-xl font-semibold">
        {question.question}
      </h2>

      {/* 🧩 Options */}
      <div className="space-y-3">
        {question.options.map((opt: string, i: number) => {
          let style = "bg-white";

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
              className={`w-full p-3 border rounded-lg text-left ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* 🎯 Feedback */}
      {showResult && (
        <div
          className={`text-center font-bold ${
            isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCorrect ? "Correct! 🎉" : "Wrong ❌"}
        </div>
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
    </div>
    </>
  );
}