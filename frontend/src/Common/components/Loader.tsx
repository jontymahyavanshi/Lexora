import { motion } from "framer-motion";

type LoaderProps = {
  text?: string;
};

export default function Loader({ text = "Loading..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <motion.div
        className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
      <p className="text-gray-600">{text}</p>
    </div>
  );
}