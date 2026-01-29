"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-32 px-6 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Advanced gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-950 opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100 via-transparent to-transparent dark:from-cyan-950 opacity-50"></div>

      {/* Static gradient orbs - Hidden on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none max-md:hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-indigo-400 dark:from-purple-600 dark:to-indigo-600 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 relative pb-2">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
        </motion.div>

        {/* Main content - Modern Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hero card - spans full width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-12 group"
          >
            <div className="relative h-full bg-gradient-to-br from-white via-blue-50/20 to-gray-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-800 rounded-3xl p-10 lg:p-12 border-2 border-gray-200 dark:border-slate-700 shadow-2xl hover:shadow-blue-500/20 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-500 overflow-hidden">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-cyan-500/5 group-hover:to-purple-500/10 transition-all duration-700"></div>

              {/* Animated border gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 opacity-30 blur-2xl"></div>
              </div>

              <div className="relative z-10">
                <div className="mb-8">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl lg:text-7xl font-black mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent leading-normal pb-2"
                  >
                    Dylan Swart
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-full"></div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">Web Developer</p>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 rounded-full"></div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="space-y-6 mb-10"
                >
                  <p className="text-xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed max-w-2xl">
                    Building modern web experiences with cutting-edge technologies.
                    <span className="inline-block ml-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg text-green-700 dark:text-green-400 text-sm font-bold">
                      🇿🇦 South Africa
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["React", "TypeScript", "Next.js", "Three.js", "Tailwind"].map((tech, i) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                        className="px-4 py-2 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-950 border-2 border-blue-300 dark:border-blue-700 rounded-xl text-sm font-bold text-blue-700 dark:text-blue-300 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>

          {/* Experience card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-12 relative group"
          >
            <div className="h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 dark:from-blue-700 dark:via-cyan-600 dark:to-blue-700 rounded-3xl p-10 shadow-2xl hover:shadow-cyan-500/50 hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/10">
              {/* Animated shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
              </div>

              {/* Floating particles */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 right-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-300"></div>
                <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
                  className="text-8xl font-black text-white mb-4 leading-none"
                >
                  3+
                </motion.div>
                <div className="text-2xl font-black text-white mb-5 tracking-tight">Years of Experience</div>
                <div className="h-1 w-20 bg-gradient-to-r from-white via-cyan-200 to-white rounded-full mb-6"></div>
                <p className="text-base text-blue-50 leading-relaxed font-medium">
                  Building modern web applications and interactive experiences
                </p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
