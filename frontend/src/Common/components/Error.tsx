import { motion } from "framer-motion";

type ErrorProps = {
  message: string;
  onRetry?: () => void;
};

export default function Error({ message, onRetry }: ErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center space-y-4 p-6"
    >
      <p className="text-red-500 text-center font-medium">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      )}
    </motion.div>
  );
}