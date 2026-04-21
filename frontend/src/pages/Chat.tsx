import Navbar from "../Common/components/Navbar";
import BackButton from "../Common/components/BackButton";
import { motion } from "framer-motion";

export default function Chat() {
  return (
    <>
      <Navbar />

      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center h-[80vh] text-center space-y-6">
        <BackButton />

        {/* 🤖 Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-6xl"
        >
          🤖
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold">
          AI Chat Coming Soon...
        </h1>

        {/* Description */}
        <p className="text-gray-500 max-w-md">
          We are working on a powerful AI chat system to help you
          learn languages in real-time. Stay tuned 🚀
        </p>

        {/* Disabled Input */}
        <div className="w-full flex gap-2 mt-4">
          <input
            disabled
            placeholder="Chat is disabled..."
            className="flex-1 p-3 border rounded bg-gray-200 cursor-not-allowed"
          />

          <button
            disabled
            className="bg-gray-400 text-white px-4 rounded cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}