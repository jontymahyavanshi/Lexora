import { useState } from "react";
import Navbar from "../../Common/components/Navbar";
import BackButton from "../../Common/components/BackButton";
import API from "../../Common/services/api";
import { useTheme } from "../../Common/hooks/useTheme";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [baseLanguage, setBaseLanguage] = useState(
    user?.baseLanguage || "English"
  );
  const [targetLanguage, setTargetLanguage] = useState(
    user?.targetLanguage || "English"
  );
  const { dark, setDark } = useTheme();
  const [message, setMessage] = useState("");

  const updateLanguage = async () => {
    try {
      const res = await API.put("/user/language", {
        baseLanguage,
        targetLanguage,
      });
    
      // 🔥 Update localStorage
      const updatedUser = {
        ...user,
        baseLanguage: res.data.baseLanguage,
        targetLanguage: res.data.targetLanguage,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("✅ Language updated");
    } catch {
      setMessage("❌ Failed to update");
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-xl mx-auto space-y-6">
        <BackButton />

        <h1 className="text-3xl font-bold">Profile 👤</h1>

        {/* 🧑 User Info */}
        <div className="bg-white p-5 rounded-xl shadow space-y-2">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            <span
              className={`px-2 py-1 text-xs rounded ${
                user?.role === "admin"
                  ? "bg-purple-200 text-purple-700"
                  : "bg-blue-200 text-blue-700"
              }`}
            >
              {user?.role}
            </span>
          </p>
        </div>

        {/* 🌍 Language Settings (Only for users) */}
        {user?.role === "user" && (
          <div className="bg-white p-5 rounded-xl shadow space-y-3">
            <h2 className="font-semibold">Language Settings 🌍</h2>

            <select
              value={baseLanguage}
              onChange={(e) => setBaseLanguage(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>

            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow space-y-3">
              <h2 className="font-semibold dark:text-white">
                Appearance 🎨
              </h2>

              <div className="flex justify-between items-center">
                <span className="dark:text-gray-300">Dark Mode</span>

                <button
                  onClick={() => setDark(!dark)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition ${dark ? "bg-blue-600" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow transform transition ${dark ? "translate-x-6" : ""
                      }`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={updateLanguage}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Save Changes
            </button>

            {message && (
              <p className="text-center text-sm">{message}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}