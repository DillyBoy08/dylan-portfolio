"use client";

import { motion } from "framer-motion";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white">Loading 3D Experience...</p>
      </div>
    </div>
  ),
});

export default function Showcase3D() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="showcase" className="py-32 px-6 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            The Portal
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-8">
            A mesmerizing gateway through space and creativity
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            {isExpanded ? "Minimize" : "Launch Experience"}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`relative rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 transition-all duration-500 ${
            isExpanded ? "h-[500px] sm:h-[600px] md:h-[800px]" : "h-[400px] sm:h-[500px] md:h-[600px]"
          }`}
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white">Initializing 3D Scene...</p>
                </div>
              </div>
            }
          >
            <Scene />
          </Suspense>

          {/* Instructions Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-white text-xs sm:text-sm">
            <p className="font-medium mb-2">Controls:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
              <div>🖱️ Drag: Rotate</div>
              <div>🔍 Scroll: Zoom</div>
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: "🌀",
              title: "Swirling Energy",
              description: "Dynamic portal rings in constant motion",
            },
            {
              icon: "✨",
              title: "Particle Streams",
              description: "Flowing particles through the wormhole",
            },
            {
              icon: "💫",
              title: "Orbiting Orbs",
              description: "Energy spheres circling the portal",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="bg-gray-900 rounded-2xl p-6 text-center border border-purple-500/20"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
