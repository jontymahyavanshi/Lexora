import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="bg-gray-200 px-3 py-1 rounded hover:bg-blue-500 transition"
    >
      ← Back
    </button>
  );
}