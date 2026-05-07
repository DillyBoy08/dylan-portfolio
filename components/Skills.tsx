"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiCss3,
  SiTailwindcss,
  SiThreedotjs,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiMongodb,
  SiFirebase,
  SiGit,
  SiFigma,
  SiDocker,
  SiVercel,
  SiPostgresql,
  SiCanva,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";
import { IconType } from "react-icons";

interface Skill {
  name: string;
  color: string;
  icon?: IconType;
  featured?: boolean;
}

const skills: Record<string, Skill[]> = {
  "Frontend": [
    { name: "React", color: "#61DAFB", icon: SiReact, featured: true },
    { name: "Next.js", color: "#000000", icon: SiNextdotjs, featured: true },
    { name: "TypeScript", color: "#3178C6", icon: SiTypescript, featured: true },
    { name: "CSS3", color: "#1572B6", icon: SiCss3 },
    { name: "Tailwind CSS", color: "#06B6D4", icon: SiTailwindcss },
    { name: "Three.js", color: "#049EF4", icon: SiThreedotjs },
  ],
  "Backend": [
    { name: "Node.js", color: "#339933", icon: SiNodedotjs, featured: true },
    { name: "Express", color: "#000000", icon: SiExpress },
    { name: "Python", color: "#3776AB", icon: SiPython, featured: true },
    { name: "MongoDB", color: "#47A248", icon: SiMongodb },
    { name: "PostgreSQL", color: "#336791", icon: SiPostgresql },
    { name: "Firebase", color: "#FFCA28", icon: SiFirebase },
  ],
  "Tools": [
    { name: "Git", color: "#F05032", icon: SiGit, featured: true },
    { name: "VS Code", color: "#007ACC", icon: VscCode },
    { name: "Figma", color: "#F24E1E", icon: SiFigma },
    { name: "Canva", color: "#00C4CC", icon: SiCanva },
    { name: "Docker", color: "#2496ED", icon: SiDocker },
    { name: "Vercel", color: "#000000", icon: SiVercel },
  ],
};

// Flatten all skills for the bento grid layout
const allSkills = Object.entries(skills).flatMap(([category, items]) =>
  items.map(skill => ({ ...skill, category }))
);

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section id="skills" className="py-32 px-6 bg-gradient-to-br from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            Tech Stack
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
            Skills & Technologies
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Modern tools and frameworks I use to build exceptional digital experiences
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-fr">
          {allSkills.map((skill, index) => {
            const isFeatured = skill.featured;
            const colSpan = isFeatured ? "sm:col-span-2" : "col-span-1";
            const rowSpan = isFeatured ? "sm:row-span-2" : "row-span-1";

            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                onHoverStart={() => setHoveredSkill(skill.name)}
                onHoverEnd={() => setHoveredSkill(null)}
                className={`${colSpan} ${rowSpan} group relative`}
              >
                <div className={`
                  h-full min-h-[140px] ${isFeatured ? 'sm:min-h-[200px]' : ''}
                  relative overflow-hidden rounded-3xl
                  bg-white dark:bg-slate-900
                  border-2 border-gray-200 dark:border-slate-800
                  hover:border-gray-300 dark:hover:border-slate-700
                  transition-all duration-500
                  hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-slate-800/50
                  hover:scale-[1.02] hover:-translate-y-1
                  cursor-pointer
                  flex flex-col items-center justify-center
                  p-6 ${isFeatured ? 'sm:p-8' : ''}
                `}>
                  {/* Gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at center, ${skill.color}08 0%, transparent 70%)`
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                    {/* Icon */}
                    <div className={`
                      transition-all duration-500
                      group-hover:scale-110 group-hover:rotate-6
                      filter drop-shadow-lg
                    `}>
                      {skill.icon && (
                        <skill.icon
                          className={`${isFeatured ? 'text-6xl sm:text-7xl' : 'text-4xl sm:text-5xl'}`}
                          style={{ color: skill.color }}
                        />
                      )}
                    </div>

                    {/* Skill Name */}
                    <div className="space-y-1">
                      <h3 className={`
                        ${isFeatured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}
                        font-bold text-gray-900 dark:text-white
                        group-hover:text-transparent group-hover:bg-clip-text
                        transition-all duration-500
                      `}
                        style={{
                          backgroundImage: hoveredSkill === skill.name ? `linear-gradient(135deg, ${skill.color} 0%, ${skill.color}dd 100%)` : undefined
                        }}
                      >
                        {skill.name}
                      </h3>

                      {/* Category + Core badge — always visible */}
                      <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <div className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                          {skill.category}
                        </div>
                        {isFeatured && (
                          <div className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            Core
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Decorative corner accent */}
                    <div
                      className="absolute top-3 right-3 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{
                        backgroundColor: skill.color,
                        boxShadow: `0 0 20px ${skill.color}`
                      }}
                    />

                  </div>

                  {/* Animated border gradient on hover */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${skill.color}20, transparent)`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom stats or info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-gray-200 dark:border-slate-800 rounded-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{allSkills.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
            </div>
            <div className="h-12 w-px bg-gray-300 dark:bg-slate-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{allSkills.filter(s => s.featured).length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Core Skills</div>
            </div>
            <div className="h-12 w-px bg-gray-300 dark:bg-slate-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
