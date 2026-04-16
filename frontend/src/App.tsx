import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Lesson from "./pages/Lesson";
import QuizSetup from "./pages/QuizSetup"; // ✅ NEW
// protected routes
import ProtectedRoute from "./Common/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* 🆕 Quiz Flow */}
        <Route path="/quiz-setup" 
        element={
        <ProtectedRoute>
          <QuizSetup />
        </ProtectedRoute>
        } />

        <Route path="/quiz" 
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        } />

        <Route path="/lesson" element={<Lesson />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;