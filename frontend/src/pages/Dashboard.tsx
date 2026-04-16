import { useEffect, useState } from "react";
import API from "../Common/services/api";
import Navbar from "../Common/components/Navbar";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/user/dashboard");

      setData(res.data);
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.status === 404) {
        setError("No dashboard data found.");
      } else {
        setError("Failed to load dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-3">{error}</p>
        <button
          onClick={fetchDashboard}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // ⚠️ No data state
  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No dashboard data available</p>
      </div>
    );
  }
if (data?.isNewUser) {
  return (
    <>
    <Navbar />
    <div className="p-6">    
        <div className="flex flex-col justify-center items-center h-screen space-y-4">
          <h1 className="text-2xl font-bold">Welcome to Lexora 🚀</h1>
          <p className="text-gray-600">
            Start your first quiz to begin learning!
          </p>

          <button
            onClick={() => (window.location.href = "/quiz")}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Start Learning
          </button>
        </div>
    </div>
    </>
  );
}
  return (
    <>
    <Navbar />
    <div className="p-6">
    <div className="p-6 space-y-6">
      {/* 🎯 Header */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* 📊 Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-xl">
          <p className="text-gray-600">XP</p>
          <h2 className="text-xl font-bold">{data?.xp || 0}</h2>
        </div>

        <div className="bg-green-100 p-4 rounded-xl">
          <p className="text-gray-600">Level</p>
          <h2 className="text-xl font-bold">{data?.level || 1}</h2>
        </div>

        <div className="bg-orange-100 p-4 rounded-xl">
          <p className="text-gray-600">Streak</p>
          <h2 className="text-xl font-bold">{data?.streak || 0}</h2>
        </div>
      </div>

      {/* 📈 Performance */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Performance</h2>
        <p>Total Quizzes: {data?.stats?.totalQuizzes || 0}</p>
        <p>Average Score: {data?.stats?.averageScore || 0}%</p>
      </div>

      {/* ⚠️ Weak Topics */}
      <div className="bg-red-100 p-4 rounded-xl">
        <h2 className="font-semibold mb-2">Weak Topics</h2>

        {data?.weakTopics?.length === 0 ? (
          <p>No weak topics 🎉</p>
        ) : (
          <ul className="list-disc ml-5">
            {data?.weakTopics?.map((topic: string, i: number) => (
              <li key={i}>{topic}</li>
            ))}
          </ul>
        )}
      </div>

      {/* 🧪 Recent Activity */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Recent Activity</h2>

        {data?.recentQuizzes?.length === 0 ? (
          <p>No quizzes yet</p>
        ) : (
          <ul className="space-y-2">
            {data?.recentQuizzes?.map((q: any, i: number) => (
              <li
                key={i}
                className="flex justify-between border-b pb-2"
              >
                <span>
                  {q.topic} ({q.type})
                </span>
                <span>
                  {q.score}/{q.total}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
    </>
  );
}