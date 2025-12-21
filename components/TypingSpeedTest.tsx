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
      return "text-gray-400/50 dark:text-gray-600/50";
    }
    return userInput[index] === currentText[index]
      ? "text-green-500 dark:text-green-400 bg-green-500/10 dark:bg-green-400/10"
      : "text-red-500 dark:text-red-400 bg-red-500/20 dark:bg-red-400/20";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (userInput.length / currentText.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 py-12 px-4 relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/30 dark:bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/30 dark:bg-blue-500/20 rounded-full blur-3xl"
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

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-block"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <h1 className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
              Typing Speed Test
            </h1>
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Test your typing speed and accuracy
          </p>
          {highScore > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600 rounded-full"
            >
              <span className="text-2xl">🏆</span>
              <span className="font-bold text-yellow-700 dark:text-yellow-400">
                High Score: {highScore} WPM
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-3 mb-8 flex-wrap"
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
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                mode === m
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-500/50 dark:shadow-purple-700/50"
                  : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 border-2 border-gray-200 dark:border-slate-600"
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-6 text-center shadow-xl text-white"
          >
            <div className="text-5xl font-black mb-1">{wpm}</div>
            <div className="text-sm font-semibold opacity-90">WPM</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl p-6 text-center shadow-xl text-white"
          >
            <div className="text-5xl font-black mb-1">{accuracy}%</div>
            <div className="text-sm font-semibold opacity-90">Accuracy</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl p-6 text-center shadow-xl text-white"
          >
            <div className="text-5xl font-black mb-1">{formatTime(timer)}</div>
            <div className="text-sm font-semibold opacity-90">Time</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 rounded-2xl p-6 text-center shadow-xl text-white"
          >
            <div className="text-5xl font-black mb-1">{streak}</div>
            <div className="text-sm font-semibold opacity-90">Streak</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-gradient-to-br from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700 rounded-2xl p-6 text-center shadow-xl text-white"
          >
            <div className="text-5xl font-black mb-1">{errors}</div>
            <div className="text-sm font-semibold opacity-90">Errors</div>
          </motion.div>
        </motion.div>

        {/* Text Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 mb-6 border-2 border-gray-200 dark:border-slate-700 shadow-2xl relative overflow-hidden"
        >
          {/* Progress Bar */}
          <motion.div
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full"
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
                className="absolute top-8 right-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
              >
                🔥 {streak} streak!
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-2xl md:text-3xl leading-loose font-mono mb-8 select-none min-h-[120px] p-6 bg-gray-50 dark:bg-slate-900 rounded-xl">
            {currentText.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`${getCharacterClass(index)} px-0.5 rounded transition-all duration-100 ${
                  index === userInput.length ? "animate-pulse border-l-2 border-blue-500" : ""
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
            whileFocus={{ scale: 1.02 }}
            className="w-full px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-xl text-lg font-mono focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white shadow-inner"
            placeholder={finished ? "Test completed!" : "Start typing..."}
          />

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-4 flex-wrap">
            <span>
              Press <kbd className="px-3 py-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 shadow">Tab</kbd> to restart
            </span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>{currentText.length} characters</span>
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
              className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-10 text-white text-center shadow-2xl relative overflow-hidden"
            >
              {/* Confetti Effect */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-yellow-300 rounded-full"
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
                className="text-8xl mb-6"
              >
                {wpm > highScore ? "🏆" : "🎉"}
              </motion.div>

              {wpm > highScore && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 px-6 py-3 bg-yellow-400 text-yellow-900 rounded-full font-black text-lg inline-block"
                >
                  🎊 NEW HIGH SCORE! 🎊
                </motion.div>
              )}

              <h2 className="text-4xl font-black mb-8">Test Complete!</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                >
                  <div className="text-6xl font-black mb-2">{wpm}</div>
                  <div className="text-sm font-semibold opacity-90">WPM</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                >
                  <div className="text-6xl font-black mb-2">{accuracy}%</div>
                  <div className="text-sm font-semibold opacity-90">Accuracy</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                >
                  <div className="text-6xl font-black mb-2">{maxStreak}</div>
                  <div className="text-sm font-semibold opacity-90">Max Streak</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                >
                  <div className="text-6xl font-black mb-2">{formatTime(timer)}</div>
                  <div className="text-sm font-semibold opacity-90">Time</div>
                </motion.div>
              </div>

              <motion.button
                onClick={() => {
                  resetTest();
                  inputRef.current?.focus();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-purple-600 rounded-2xl font-black text-xl hover:bg-gray-100 transition-colors shadow-xl"
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips */}
        {!started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full border-2 border-purple-200 dark:border-purple-800">
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-2xl"
              >
                💡
              </motion.span>
              <span className="font-semibold text-purple-800 dark:text-purple-300">
                Tip: Focus on accuracy first, speed will come naturally!
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
