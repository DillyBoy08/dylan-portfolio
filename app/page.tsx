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
import CustomCursor from "@/components/CustomCursor";
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
        <CustomCursor />
        <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
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
