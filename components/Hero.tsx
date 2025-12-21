"use client";

import { motion } from "framer-motion";
import ParticleBackground from "./ParticleBackground";
import TypingEffect from "./TypingEffect";

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Hero section"
      className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      {/* Particle Background */}
      <ParticleBackground />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-300 dark:bg-cyan-600 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Hi, I'm badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="px-6 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-full shadow-lg border border-blue-200 dark:border-blue-700">
              <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                👋 Hi, I&apos;m
              </p>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 gradient-text leading-tight pb-4"
          >
            Dylan Swart
          </motion.h1>

          {/* Typing Effect Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <div className="text-3xl sm:text-4xl md:text-6xl font-semibold text-gray-800 dark:text-gray-200 min-h-[1.5em] flex items-center justify-center">
              <TypingEffect
                texts={[
                  "Web Developer",
                  "UI/UX Designer",
                  "Creative Coder",
                  "Problem Solver"
                ]}
              />
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Building modern, responsive web applications with clean code and creative design.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#projects"
              className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-medium hover:shadow-2xl hover:shadow-blue-500/50 dark:hover:shadow-blue-500/30 hover:scale-105 transition-all text-center text-lg"
            >
              <span className="flex items-center justify-center gap-2">
                View My Work
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            <a
              href="#contact"
              className="group px-10 py-5 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-800 dark:text-gray-200 rounded-full font-medium hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all text-center text-lg"
            >
              <span className="flex items-center justify-center gap-2">
                Get in Touch
                <svg className="w-5 h-5 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Scroll to explore</span>
          <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
