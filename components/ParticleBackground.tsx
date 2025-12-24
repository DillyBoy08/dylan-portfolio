"use client";

import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Detect mobile devices and prefer reduced motion
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Disable only if user prefers reduced motion
    if (prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;

        // Random color from blue/cyan/indigo gradient
        const colors = [
          "rgba(59, 130, 246, 0.5)",  // blue
          "rgba(96, 165, 250, 0.5)",  // blue-light
          "rgba(6, 182, 212, 0.5)",   // cyan
          "rgba(34, 211, 238, 0.4)",  // cyan-light
          "rgba(99, 102, 241, 0.5)",  // indigo
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles - reduced count on mobile for better performance
    const particleCount = isMobile ? 30 : 50; // Even fewer particles on mobile
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections - optimized with early distance check
      const maxDistance = 150;
      const maxDistanceSq = maxDistance * maxDistance; // Use squared distance to avoid sqrt

      for (let i = 0; i < particles.length; i++) {
        const particleA = particles[i];

        // Only check next particles to avoid duplicate connections
        for (let j = i + 1; j < particles.length; j++) {
          const particleB = particles[j];

          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distanceSq = dx * dx + dy * dy;

          // Early exit if too far (avoid expensive sqrt)
          if (distanceSq < maxDistanceSq) {
            const distance = Math.sqrt(distanceSq);
            const opacity = 0.2 * (1 - distance / maxDistance);

            // Alternate between blue, cyan, and indigo connections
            const colors = [
              `rgba(59, 130, 246, ${opacity})`,   // blue
              `rgba(6, 182, 212, ${opacity})`,    // cyan
              `rgba(99, 102, 241, ${opacity})`    // indigo
            ];
            ctx.strokeStyle = colors[i % 3];
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}
