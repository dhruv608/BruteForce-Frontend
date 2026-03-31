"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const steps = [
  "Optimizing Paths...",
  "Dry Running Cases...",
  "Exploring States...",
  "Minimizing Complexity...",
];

export default function Loading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0A] text-[#CCFF00] overflow-hidden">

      {/* BruteForce Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-mono font-bold tracking-wide"
      >
        {"<BruteForce />"}
      </motion.div>

      {/* Changing Text */}
      <div className="h-6 mt-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={steps[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-sm md:text-base text-[#CCFF00]/70 font-mono"
          >
            {steps[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Dots Animation */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-[#CCFF00]"
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-[#CCFF00]/10 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

    </div>
  );
}