"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Component to handle project previews with live iframe
function ProjectPreview({
  previewUrl,
  icon,
  gradient,
  title,
}: {
  previewUrl: string | null;
  icon: string;
  gradient: string;
  title: string;
}) {
  const [iframeError, setIframeError] = useState(false);

  if (iframeError || !previewUrl) {
    // Fallback to gradient placeholder with icon
    return (
      <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-700`}>
        <div className="text-9xl opacity-20">{icon}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900">
      {/* Live iframe preview */}
      <iframe
        src={previewUrl}
        title={`${title} preview`}
        loading="lazy"
        className="w-full h-full border-0 pointer-events-none group-hover:scale-105 transition-transform duration-700 origin-top-left"
        onError={() => setIframeError(true)}
      />
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

      {/* Hover overlay to show it's clickable */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none flex items-center justify-center">
        <div className="bg-white/0 group-hover:bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-gray-900 text-sm font-bold">Click to interact</span>
        </div>
      </div>
    </div>
  );
}

const projects = [
  {
    title: "Weather App",
    description: "Real-time weather application with 5-day forecasts, city search, and beautiful animations. Features current conditions, humidity, wind speed, and more.",
    tech: ["React", "TypeScript", "OpenWeather API", "Framer Motion"],
    gradient: "from-blue-500 to-cyan-500",
    icon: "⛅",
    previewUrl: "/weather-app",
    link: "/weather-app",
    github: null,
  },
  {
    title: "Typing Speed Test",
    description: "Test your typing speed and accuracy with multiple text modes. Features real-time WPM calculation, accuracy tracking, beautiful animations, and different challenge modes including quotes, code, and random words.",
    tech: ["React", "TypeScript", "Framer Motion", "Real-time Stats"],
    gradient: "from-purple-500 to-pink-500",
    icon: "⌨️",
    previewUrl: "/typing-test",
    link: "/typing-test",
    github: null,
  },
  {
    title: "Colour Detector",
    description: "Extract and analyse colours from any image. Click to detect pixel colours, view dominant colour palettes, and copy colour codes instantly.",
    tech: ["React", "TypeScript", "Canvas API", "Colour Theory"],
    gradient: "from-pink-500 to-purple-600",
    icon: "🎨",
    previewUrl: "/color-detector",
    link: "/color-detector",
    github: null,
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50 dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-900/50 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            Projects
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
            Explore my latest work in web development
          </p>
        </motion.div>

        {/* Projects */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-slate-800/50">
                  <div className="grid md:grid-cols-5 gap-0">
                    {/* Live Preview - Takes up more space */}
                    <div className="md:col-span-3 relative h-[300px] md:h-[400px] overflow-hidden">
                      <ProjectPreview
                        previewUrl={project.previewUrl}
                        icon={project.icon}
                        gradient={project.gradient}
                        title={project.title}
                      />

                      {/* Status indicator on preview */}
                      <div className="absolute top-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-10 pointer-events-none">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Live Preview
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2 p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                          {project.description}
                        </p>

                        {/* Tech stack */}
                        <div className="flex flex-wrap gap-2 mb-8">
                          {project.tech.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className={`flex gap-3 ${project.github ? "" : "justify-center"}`}>
                        <div className={`${project.github ? "flex-1" : "w-full"} px-6 py-3 bg-gradient-to-r ${project.gradient} text-white rounded-xl text-sm font-semibold text-center flex items-center justify-center gap-2 group-hover:shadow-lg transition-all`}>
                          Open Project
                          <svg className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        {project.github && (
                          <a
                            href={project.github}
                            onClick={(e) => e.stopPropagation()}
                            className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center"
                            aria-label="View GitHub repository"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
