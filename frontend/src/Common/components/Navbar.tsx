import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-xl font-bold text-blue-600">
        Lexora 🚀
      </h1>

      {/* Links */}
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>

        <Link to="/quiz-setup" className="hover:text-blue-600">
          Quiz
        </Link>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}