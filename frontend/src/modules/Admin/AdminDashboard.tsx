import { useEffect, useState } from "react";
import API from "../../Common/services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../../Common/components/Layout";
export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Admin stats error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <>
      <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard 👑</h1>

        {/* 📊 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card title="Users" value={stats?.totalUsers} />
          <Card title="Quizzes" value={stats?.totalQuizzes} />
          <Card title="Languages" value="5" />
          <Card title="Active Users" value={stats?.activeUsers} />
        </div>

        {/* 🚀 Actions */}
        <div className="bg-white p-5 rounded-xl shadow space-y-3">
          <h2 className="font-semibold">Quick Actions</h2>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/admin/quiz")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Manage Quizzes 🎯
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Manage Users 👥
            </button>
          </div>
        </div>

        {/* 📈 Chart Placeholder */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Usage Overview</h2>

          <div className="h-40 flex items-end gap-2">
            {[40, 70, 30, 90, 60].map((h, i) => (
              <div
                key={i}
                className="bg-blue-500 w-full rounded"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
    </>
  );
}

function Card({ title, value }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-4 rounded-xl shadow"
    >
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value || 0}</h2>
    </motion.div>
  );
}