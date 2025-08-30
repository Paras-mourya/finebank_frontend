"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
      {/* Rotating ring */}
      <motion.div
        className="w-20 h-20 rounded-full border-4 border-green-800/60 border-t-green-800"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
      />

      {/* Pulse circle */}
      <motion.div
        className="absolute w-12 h-12 rounded-full bg-gradient-to-r from-green-200 to-black shadow-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
