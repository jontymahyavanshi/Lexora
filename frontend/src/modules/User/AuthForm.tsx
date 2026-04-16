import { useState } from "react";
import API from "../../Common/services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Common/hooks/useAuth";

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

      // 🚀 Redirect
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          {type === "login" ? "Login" : "Register"}
        </h2>

        {type === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 border mb-3 rounded"
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border mb-3 rounded"
          onChange={handleChange}
          required
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : type === "login"
            ? "Login"
            : "Register"}
        </button>
      </form>
    </div>
  );
}