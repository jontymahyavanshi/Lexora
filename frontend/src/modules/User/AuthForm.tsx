import { useState } from "react";
import API from "../../Common/services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Common/hooks/useAuth";
import { motion } from "framer-motion";

type Props = {
  type: "login" | "register";
};

export default function AuthForm({ type }: Props) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url =
        type === "login" ? "/user/login" : "/user/signup";

      const { data } = await API.post(url, form);

      // ✅ Save token
      login(data.token);

      // 🔥 Save user (IMPORTANT for admin role later)
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🚀 Redirect
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-80 space-y-4"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-blue-600">
          {type === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {/* Name (only register) */}
        {type === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        />

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : type === "login"
            ? "Login"
            : "Register"}
        </button>

        {/* 🔄 Switch Links */}
        <p className="text-sm text-center text-gray-600">
          {type === "login" ? (
            <>
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </>
          )}
        </p>
      </motion.form>
    </div>
  );
}