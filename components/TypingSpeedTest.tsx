"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  TbKeyboard,
  TbChartBar,
  TbTarget,
  TbFlame,
  TbArrowLeft,
  TbBrandGithub,
  TbTrophy,
  TbClock,
} from "react-icons/tb";

const textModes = {
  quotes: [
    "The only way to do great work is to love what you do.",
    "Life is what happens when you're busy making other plans.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "In the middle of difficulty lies opportunity.",
    "The only impossible journey is the one you never begin.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Innovation distinguishes between a leader and a follower.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
  ],
  code: [
    "const greeting = (name) => { return `Hello, ${name}!`; };",
    "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }",
    "const array = [1, 2, 3].map(x => x * 2).filter(x => x > 2);",
    "class Person { constructor(name) { this.name = name; } }",
    "async function fetchData() { const res = await fetch(url); return res.json(); }",
    "const debounce = (fn, delay) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; };",
    "interface User { id: number; name: string; email: string; }",
    "const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);",
  ],
  words: [
    "apple banana cherry dragon elephant forest guitar harmony island journey keyboard lemon mountain notebook ocean piano quantum rainbow sunset thunder umbrella victory whisper xylophone yellow zebra",
    "adventure brave crystal diamond elegant fantasy galaxy horizon infinite journey kingdom liberty mountain noble ocean paradise quantum river sunset treasure unity victory wisdom xenon yellow zodiac",
    "abstract brilliant cosmic dynamic electric frozen golden harmony infinite justice kinetic lunar mystic nebula orbit phantom quantum radiant stellar triumph universe velocity wisdom zenith",
    "bloom cascade divine ethereal flourish glimmer haven impulse jovial kindle limitless mystic noble opulent pristine quaint radiant serene transcend uplift vivid wanderlust xanadu yearning zephyr",
  ],
  extreme: [
    "The quick brown fox jumps over the lazy dog while simultaneously calculating the trajectory of a quantum particle in a three-dimensional space-time continuum.",
    "Supercalifragilisticexpialidocious pneumonoultramicroscopicsilicovolcanoconiosis hippopotomonstrosesquippedaliophobia pseudopseudohypoparathyroidism",
    "In a world where artificial intelligence and machine learning algorithms continuously evolve, software engineers must adapt their methodologies to incorporate cutting-edge technologies.",
  ],
};

type TextMode = keyof typeof textModes;

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export default function TypingSpeedTest() {
  const [mode, setMode] = useState<TextMode>("quotes");
  const [currentText, setCurrentText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timer, setTimer] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [errors, setErrors] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("typingHighScore") || "0");
    }
    return 0;
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const particleIdRef = useRef(0);

  const resetTest = useCallback(() => {
    const texts = textModes[mode];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(randomText);
    setUserInput("");
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setTimer(0);
    setStreak(0);
    setMaxStreak(0);
    setErrors(0);
    setParticles([]);
  }, [mode]);

  useEffect(() => {
    resetTest();
  }, [mode, resetTest]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (started && !finished) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started, finished]);

  useEffect(() => {
    if (particles.length > 0) {
      const timeout = setTimeout(() => {
        setParticles((prev) => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [particles]);

  const createParticle = (x: number, y: number, isCorrect: boolean) => {
    const colors = isCorrect
      ? ["#10b981", "#34d399", "#6ee7b7"]
      : ["#ef4444", "#f87171", "#fca5a5"];
    const particle: Particle = {
      id: particleIdRef.current++,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
    };
    setParticles((prev) => [...prev, particle]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }

    const lastChar = value[value.length - 1];
    const isCorrect = lastChar === currentText[value.length - 1];

    if (value.length > userInput.length) {
      if (isCorrect) {
        setStreak((prev) => {
          const newStreak = prev + 1;
          setMaxStreak((max) => Math.max(max, newStreak));
          return newStreak;
        });
        if (inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          createParticle(
            rect.left + Math.random() * rect.width,
            rect.top + Math.random() * 20,
            true
          );
        }
      } else {
        setStreak(0);
        setErrors((prev) => prev + 1);
        if (inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          createParticle(
            rect.left + Math.random() * rect.width,
            rect.top + Math.random() * 20,
            false
          );
        }
      }
    }

    setUserInput(value);

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentText[i]) {
        correct++;
      }
    }
    const acc = value.length > 0 ? Math.round((correct / value.length) * 100) : 100;
    setAccuracy(acc);

    // Calculate WPM
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60;
      const wordsTyped = value.trim().split(/\s+/).length;
      const calculatedWpm = Math.round(wordsTyped / timeElapsed);
      setWpm(calculatedWpm);
    }

    // Check if finished
    if (value === currentText) {
      setFinished(true);
      if (wpm > highScore) {
        setHighScore(wpm);
        if (typeof window !== "undefined") {
          localStorage.setItem("typingHighScore", wpm.toString());
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      resetTest();
      inputRef.current?.focus();
    }
  };

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) {
      return "text-gray-400 dark:text-gray-500";
    }
    return userInput[index] === currentText[index]
      ? "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10"
      : "text-rose-500 dark:text-rose-400 bg-rose-500/10";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (userInput.length / currentText.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-300/20 dark:bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1, x: particle.x, y: particle.y, scale: 1 }}
            animate={{
              opacity: 0,
              y: particle.y - 100,
              x: particle.x + (Math.random() - 0.5) * 50,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute pointer-events-none rounded-full"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Professional Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-700 dark:via-purple-700 dark:to-fuchsia-700 shadow-2xl overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)",
              backgroundSize: "200% 200%",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
          >
            <TbArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Portfolio</span>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <TbKeyboard className="text-6xl sm:text-7xl text-white drop-shadow-lg" />
                </motion.div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg pb-1">
                  Typing Speed Test
                </h1>
              </div>
              <p className="text-white/90 text-lg flex items-center gap-2 ml-1">
                <motion.span
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="inline-block w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                />
                Challenge yourself and improve your typing skills
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              {highScore > 0 && (
                <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 shadow-xl">
                  <div className="text-xs text-white/80 font-medium flex items-center gap-1">
                    <TbTrophy className="text-yellow-300" /> Personal Best
                  </div>
                  <motion.div
                    key={highScore}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl font-black text-white"
                  >
                    {highScore} WPM
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <motion.path
              d="M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-slate-50 dark:text-slate-950"
              animate={{
                d: [
                  "M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z",
                  "M0,30 Q300,0 600,50 T1200,30 L1200,120 L0,120 Z",
                  "M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto relative z-10 py-8 sm:py-12 px-4 sm:px-6">

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap px-2"
        >
          {(Object.keys(textModes) as TextMode[]).map((m, idx) => (
            <motion.button
              key={m}
              onClick={() => setMode(m)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all ${
                mode === m
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Stats Grid - Optimized for Mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg text-white"
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">{wpm}</div>
            <div className="text-xs sm:text-sm font-semibold opacity-90">WPM</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg text-white"
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">{accuracy}%</div>
            <div className="text-xs sm:text-sm font-semibold opacity-90">Accuracy</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg text-white"
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">{formatTime(timer)}</div>
            <div className="text-xs sm:text-sm font-semibold opacity-90">Time</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-orange-500 to-amber-600 dark:from-orange-600 dark:to-amber-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg text-white"
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">{streak}</div>
            <div className="text-xs sm:text-sm font-semibold opacity-90">Streak</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg text-white col-span-2 sm:col-span-1"
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">{errors}</div>
            <div className="text-xs sm:text-sm font-semibold opacity-90">Errors</div>
          </motion.div>
        </motion.div>

        {/* Text Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-6 border border-gray-200 dark:border-slate-700 shadow-xl relative overflow-hidden"
        >
          {/* Progress Bar */}
          <motion.div
            className="absolute top-0 left-0 h-1 sm:h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />

          {/* Streak notification */}
          <AnimatePresence>
            {streak >= 10 && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-4 sm:top-8 right-4 sm:right-8 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg"
              >
                🔥 {streak} streak!
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose font-mono mb-6 sm:mb-8 select-none min-h-[80px] sm:min-h-[120px] p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 rounded-xl overflow-x-auto">
            {currentText.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`${getCharacterClass(index)} px-0.5 rounded transition-all duration-100 ${
                  index === userInput.length ? "animate-pulse border-l-2 border-violet-500" : ""
                }`}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Input */}
          <motion.input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={finished}
            autoFocus
            whileFocus={{ scale: 1.01 }}
            className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-slate-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-base sm:text-lg font-mono focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
            placeholder={finished ? "Test completed! 🎉" : "Click here and start typing..."}
          />

          <div className="mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              Press <kbd className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 text-xs sm:text-sm">Tab</kbd> to restart
            </span>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
            <span className="hidden sm:inline">{currentText.length} characters</span>
          </div>
        </motion.div>

        {/* Results Modal */}
        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-2xl relative overflow-hidden"
            >
              {/* Confetti Effect */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full"
                  initial={{
                    x: "50%",
                    y: "50%",
                    scale: 0,
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl sm:text-8xl mb-4 sm:mb-6"
              >
                {wpm > highScore ? "🏆" : "🎉"}
              </motion.div>

              {wpm > highScore && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-amber-400 text-amber-900 rounded-full font-black text-sm sm:text-lg inline-block"
                >
                  🎊 NEW HIGH SCORE! 🎊
                </motion.div>
              )}

              <h2 className="text-3xl sm:text-4xl font-black mb-6 sm:mb-8">Test Complete!</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6"
                >
                  <div className="text-4xl sm:text-6xl font-black mb-2">{wpm}</div>
                  <div className="text-xs sm:text-sm font-semibold opacity-90">WPM</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6"
                >
                  <div className="text-4xl sm:text-6xl font-black mb-2">{accuracy}%</div>
                  <div className="text-xs sm:text-sm font-semibold opacity-90">Accuracy</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6"
                >
                  <div className="text-4xl sm:text-6xl font-black mb-2">{maxStreak}</div>
                  <div className="text-xs sm:text-sm font-semibold opacity-90">Max Streak</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6"
                >
                  <div className="text-4xl sm:text-6xl font-black mb-2">{formatTime(timer)}</div>
                  <div className="text-xs sm:text-sm font-semibold opacity-90">Time</div>
                </motion.div>
              </div>

              <motion.button
                onClick={() => {
                  resetTest();
                  inputRef.current?.focus();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-violet-600 rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl hover:bg-gray-100 transition-colors shadow-xl"
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Professional Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative w-full bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 dark:from-slate-950 dark:via-gray-950 dark:to-slate-950 mt-16 overflow-hidden"
      >
        {/* Top wave decoration */}
        <div className="absolute top-0 left-0 right-0 transform rotate-180">
          <svg className="w-full h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <motion.path
              d="M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-slate-50 dark:text-slate-950"
              animate={{
                d: [
                  "M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z",
                  "M0,30 Q300,0 600,50 T1200,30 L1200,120 L0,120 Z",
                  "M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30 hidden sm:block"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(217, 70, 239, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { Icon: TbChartBar, label: "Real-time Stats", value: "Live WPM Tracking", color: "text-blue-400" },
              { Icon: TbTarget, label: "Accuracy Analysis", value: "Character-by-Character", color: "text-emerald-400" },
              { Icon: TbFlame, label: "Streak System", value: "Build Momentum", color: "text-orange-400" },
              { Icon: TbClock, label: "Multiple Modes", value: "4 Text Categories", color: "text-purple-400" },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl"
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                  className="mb-4"
                >
                  <feature.Icon className={`text-5xl ${feature.color}`} />
                </motion.div>
                <div className="text-white/60 text-sm font-medium mb-1">{feature.label}</div>
                <div className="text-white text-lg font-bold">{feature.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Footer Content */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-center md:text-left"
              >
                <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                  <TbKeyboard className="text-3xl text-violet-400" />
                  Typing Speed Test
                </h3>
                <p className="text-white/70">
                  Improve your typing skills with real-time feedback
                </p>
                <p className="text-white/50 text-sm mt-2">
                  Built with Next.js, TypeScript & Framer Motion
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex flex-col items-center md:items-end gap-4"
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <TbArrowLeft />
                  Back to Portfolio
                </Link>
                <p className="text-white/50 text-sm">
                  © {new Date().getFullYear()} Dylan Swart. All rights reserved.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full hidden sm:block"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.footer>
    </div>
  );
}
