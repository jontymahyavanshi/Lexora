import { useEffect, useState } from "react";
import API from "../Common/services/api";
import Navbar from "../Common/components/Navbar";
import Loader from "../Common/components/Loader";
import Error from "../Common/components/Error";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../Common/components/Layout";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/user/dashboard");
      setData(res.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <Error message={error} onRetry={fetchDashboard} />;

  if (data?.isNewUser) {
    return (
      <>
         <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col justify-center items-center h-screen space-y-4 text-center">
          <h1 className="text-4xl font-bold">Welcome to Lexora 🚀</h1>
          <p className="text-gray-600">
            Start your first quiz to begin learning!
          </p>

          <button
            onClick={() => navigate("/quiz-setup")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Start Learning 🎯
          </button>
        </div>
      </div>
    </Layout>
      </>
    );
  }

  return (
    <>
       <Layout>
      <div className="max-w-6xl mx-auto space-y-6"></div>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* 🔥 HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow"
        >
          <h1 className="text-3xl font-bold">
            Welcome back 👋
          </h1>
          <p className="text-sm opacity-90">
            Keep learning daily and improve your skills 🚀
          </p>
        </motion.div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="XP" value={data?.xp} color="blue" />
          <Card title="Level" value={data?.level} color="green" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`p-5 rounded-xl shadow flex items-center justify-between ${data?.streak > 0
                ? "bg-orange-100 text-orange-700 shadow-orange-300"
                : "bg-gray-100 text-gray-500"
              }`}
          >
            <div>
              <p>Streak</p>
              <h2 className="text-2xl font-bold">{data?.streak}</h2>
            </div>

            {/* 🔥 Fire Animation */}
            <motion.div
              animate={
                data?.streak > 0
                  ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }
                  : {}
              }
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
              className="text-3xl"
            >
              🔥
            </motion.div>
            <p className="text-sm mt-1">
              {data?.streak === 0 && "Start your streak today 💪"}
              {data?.streak > 0 && data?.streak < 5 && "Good start 🔥"}
              {data?.streak >= 5 && data?.streak < 10 && "You're on fire 🚀"}
              {data?.streak >= 10 && "Legend mode 🔥🔥🔥"}
            </p>
          </motion.div>
        </div>

        {/* ⚡ QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Action
            title="Start Quiz 🎯"
            onClick={() => navigate("/quiz-setup")}
          />
          <Action
            title="Lesson 📚"
            onClick={() => navigate("/lesson")}
          />
          <Action
            title="AI Chat 🤖"
            onClick={() => navigate("/chat")}
          />
        </div>

        {/* 📈 XP BAR */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">XP Progress</h2>

          <div className="w-full bg-gray-200 h-3 rounded-full">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{
                width: `${Math.min((data?.xp || 0) % 100, 100)}%`,
              }}
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {(data?.xp || 0) % 100}/100 XP to next level
          </p>
        </div>

        {/* 📊 PERFORMANCE */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Performance</h2>
          <p>Total Quizzes: {data?.stats?.totalQuizzes}</p>
          <p>Average Score: {data?.stats?.averageScore}%</p>
        </div>

        {/* ⚠️ WEAK TOPICS */}
        <div className="bg-red-50 p-5 rounded-xl">
          <h2 className="font-semibold mb-2">Weak Topics</h2>

          {data?.weakTopics?.length === 0 ? (
            <p>No weak topics 🎉</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data?.weakTopics.map((t: string, i: number) => (
                <span
                  key={i}
                  className="bg-red-200 px-3 py-1 rounded-full text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 🧪 RECENT ACTIVITY */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Recent Activity</h2>

          {data?.recentQuizzes?.length === 0 ? (
            <p>No quizzes yet</p>
          ) : (
            <div className="space-y-3">
              {data.recentQuizzes.map((q: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {q.topic} ({q.type})
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(q.date).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="font-bold text-blue-600">
                    {q.score}/{q.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
    </>
  );
}

// 🔹 Stats Card
function Card({ title, value, color }: any) {
  const styles: any = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-5 rounded-xl shadow ${styles[color]}`}
    >
      <p>{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </motion.div>
  );
}

// 🔹 Quick Action Button
function Action({ title, onClick }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="bg-white p-5 rounded-xl shadow hover:bg-gray-100 transition text-left"
    >
      <h3 className="font-semibold">{title}</h3>
    </motion.button>
  );
}