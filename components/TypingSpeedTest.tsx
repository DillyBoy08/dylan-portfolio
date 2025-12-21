"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

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

  useEffect(() => {
    resetTest();
  }, [mode]);

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

  const resetTest = () => {
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
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-10"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent mb-3">
            Typing Speed Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-medium">
            Test your typing speed and accuracy
          </p>
          {highScore > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-300 dark:border-amber-700 rounded-full shadow-sm"
            >
              <span className="text-xl">🏆</span>
              <span className="font-bold text-amber-700 dark:text-amber-400 text-sm sm:text-base">
                Best: {highScore} WPM
              </span>
            </motion.div>
          )}
        </motion.div>

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
    </div>
  );
}
