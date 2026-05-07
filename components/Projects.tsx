"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Component to handle project previews with live iframe
function ProjectPreview({
  previewUrl,
  icon = "",
  gradient,
  title,
}: {
  previewUrl: string | null;
  icon?: string;
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

const projects: {
  title: string;
  description: string;
  tech: string[];
  gradient: string;
  previewUrl: string | null;
  link: string;
  github: string | null;
}[] = [];

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

        {/* Projects list / empty state */}
        {projects.length > 0 ? (
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
                      <div className="md:col-span-3 relative h-[300px] md:h-[400px] overflow-hidden">
                        <ProjectPreview
                          previewUrl={project.previewUrl}
                          icon=""
                          gradient="from-blue-500 to-cyan-500"
                          title={project.title}
                        />
                        <div className="absolute top-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-10 pointer-events-none">
                          <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></span>
                            Live Preview
                          </span>
                        </div>
                      </div>
                      <div className="md:col-span-2 p-8 md:p-10 flex flex-col justify-between">
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-8">
                            {project.tech.map((tech, i) => (
                              <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-semibold text-center flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                            Open Project
                            <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          {project.github && (
                            <a href={project.github} className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center" aria-label="View GitHub repository">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 px-8 py-20 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-cyan-50/40 dark:from-blue-950/20 dark:via-transparent dark:to-cyan-950/20 pointer-events-none" aria-hidden="true" />
              <div className="relative z-10 max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 border border-blue-200 dark:border-blue-800 mb-6" aria-hidden="true">
                  <svg className="w-7 h-7 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Projects coming soon
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  I&apos;m curating a selection of projects that best represent my work. Check back shortly.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
