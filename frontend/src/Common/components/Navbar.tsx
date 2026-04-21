import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔒 Close dropdown on outside click
  useEffect(() => {
    const handleClick = () => setOpen(false);
    if (open) {
      window.addEventListener("click", handleClick);
    }
    return () => window.removeEventListener("click", handleClick);
  }, [open]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow px-6 py-3 flex justify-between items-center">
      
      {/* 🔷 Logo */}
      <h1
        onClick={() =>
          navigate(user?.role === "admin" ? "/admin" : "/dashboard")
        }
        className="text-xl font-bold text-blue-600 cursor-pointer hover:opacity-80 transition"
      >
        Lexora 🚀
      </h1>

      {/* 🔗 NAV LINKS */}
      <div className="flex items-center gap-6">
        
        {/* 👤 USER NAV */}
        {user?.role === "user" && (
          <>
            <Link to="/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>

            <Link to="/quiz-setup" className="hover:text-blue-600 transition">
              Quiz
            </Link>

            <Link to="/lesson" className="hover:text-blue-600 transition">
              Learn
            </Link>

            <Link to="/chat" className="hover:text-blue-600 transition">
              AI Chat
            </Link>
          </>
        )}

        {/* 👑 ADMIN NAV */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin" className="hover:text-blue-600 transition">
              Dashboard
            </Link>

            <Link to="/admin/quiz" className="hover:text-blue-600 transition">
              Quizzes
            </Link>

            <Link to="/admin/users" className="hover:text-blue-600 transition">
              Users
            </Link>

            <Link to="/chat" className="hover:text-blue-600 transition">
              AI Chat
            </Link>
          </>
        )}

        {/* 👤 PROFILE DROPDOWN */}
        {user && (
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // 🔥 prevent close when clicking inside
          >
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {/* 🟢 Avatar */}
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <span className="text-sm font-medium hidden sm:block">
                {user.name}
              </span>
            </div>

            {/* 🔽 Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50 animate-fadeIn">
                
                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  👤 Profile
                </button>

                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}