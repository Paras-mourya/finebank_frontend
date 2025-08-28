"use client";

import { motion } from "framer-motion";


export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      
        {/* Rotating ring */}
        <motion.div
          className="absolute w-28 h-28 rounded-full border-4 border-green-600/60 border-t-green-400"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        />

        {/* Pulse circle */}
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-green-200 to-black shadow-lg"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2 - 0.5,
            ease: "easeInOut",
          }}
        />

        {/* Text */}
        <motion.span
          className="text-black font-semibold tracking-wide text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          
        </motion.span>

    </div>
  );
}
