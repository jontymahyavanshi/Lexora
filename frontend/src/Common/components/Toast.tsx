import { motion } from "framer-motion";

export default function Toast({ message, type }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white z-50 ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-blue-500"
      }`}
    >
      {message}
    </motion.div>
  );
}