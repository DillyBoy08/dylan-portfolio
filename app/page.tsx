"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import LoadingScreen from "@/components/LoadingScreen";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
  useEffect(() => {
    // Ensure page starts at the top on initial load
    const scrollToTop = () => {
      if (typeof window !== "undefined" && !window.location.hash) {
        window.scrollTo(0, 0);
      }
    };

    scrollToTop();

    // Force scroll to top after a brief delay to override any default behavior
    const timer = setTimeout(() => {
      scrollToTop();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LoadingScreen />
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <main id="main-content" className="min-h-dvh bg-white dark:bg-slate-950 transition-colors duration-300">
          <Navbar />
          <Hero />
          <Projects />
          <Skills />
          <About />
          <Contact />
          <Footer />
          <ScrollToTop />
        </main>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
