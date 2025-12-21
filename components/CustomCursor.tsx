"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouseX = 0;
    let mouseY = 0;

    const trail: { x: number; y: number; opacity: number }[] = [];
    const maxTrailLength = 20;

    const updatePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      trail.push({ x: mouseX, y: mouseY, opacity: 1 });
      if (trail.length > maxTrailLength) {
        trail.shift();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail
      trail.forEach((point, index) => {
        const opacity = (index / trail.length) * point.opacity;
        const size = (index / trail.length) * 10 + 2;

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${opacity * 0.6})`;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(point.x, point.y, size + 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${opacity * 0.3})`;
        ctx.fill();

        point.opacity *= 0.95;
      });

      // Draw main cursor
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 6, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 6);
      gradient.addColorStop(0, "rgba(139, 92, 246, 1)");
      gradient.addColorStop(1, "rgba(99, 102, 241, 0.8)");
      ctx.fillStyle = gradient;
      ctx.fill();

      // Outer glow
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 12, 0, Math.PI * 2);
      const outerGlow = ctx.createRadialGradient(mouseX, mouseY, 6, mouseX, mouseY, 12);
      outerGlow.addColorStop(0, "rgba(139, 92, 246, 0.4)");
      outerGlow.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.fillStyle = outerGlow;
      ctx.fill();

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
      />

      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
