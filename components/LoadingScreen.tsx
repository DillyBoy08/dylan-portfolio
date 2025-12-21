"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simple timer - loads quickly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
        >
          <div className="text-center">
            {/* Enhanced Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut"
              }}
              className="relative"
            >
              {/* Glow effect behind */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-30"
              />

              {/* The D letter */}
              <h1 className="text-9xl font-bold gradient-text relative drop-shadow-lg">
                D
              </h1>
            </motion.div>

            {/* Elegant spinner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mt-8"
            >
              <div className="relative w-12 h-12">
                {/* Outer ring */}
                <div className="absolute inset-0 border-2 border-gray-200 rounded-full" />
                {/* Spinning gradient ring */}
                <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 border-r-cyan-500 rounded-full animate-spin" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
