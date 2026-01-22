/**
 * Application-wide constants for performance and animation settings.
 * Centralizes magic numbers for easier maintenance and consistency.
 */

// Animation timing constants
export const ANIMATION = {
  /** Delay before boot animation starts (in seconds) */
  BOOT_DELAY: 1,
  /** Amplitude for floating animations */
  FLOAT_AMPLITUDE: 0.1,
  /** Base rotation speed for hover effects */
  ROTATION_SPEED: 0.02,
  /** Loading screen display duration (in ms) */
  LOADING_DURATION: 1500,
} as const;

// Particle system constants
export const PARTICLES = {
  /** Particle count for desktop devices */
  DESKTOP_COUNT: 300,
  /** Particle count for mobile devices */
  MOBILE_COUNT: 100,
  /** Particle count when reduced motion is preferred */
  REDUCED_MOTION_COUNT: 50,
} as const;

// Portal particle stream constants
export const PORTAL_PARTICLES = {
  /** Particle count for desktop devices */
  DESKTOP_COUNT: 1000,
  /** Particle count for mobile devices */
  MOBILE_COUNT: 300,
  /** Particle count when reduced motion is preferred */
  REDUCED_MOTION_COUNT: 100,
} as const;

// Star field constants
export const STARS = {
  /** Star count for desktop devices */
  DESKTOP_COUNT: 1500,
  /** Star count for mobile devices */
  MOBILE_COUNT: 500,
  /** Star count when reduced motion is preferred */
  REDUCED_MOTION_COUNT: 300,
} as const;

// Breakpoints (should match Tailwind config)
export const BREAKPOINTS = {
  /** Mobile breakpoint in pixels */
  MOBILE: 768,
  /** Tablet breakpoint in pixels */
  TABLET: 1024,
  /** Desktop breakpoint in pixels */
  DESKTOP: 1280,
} as const;

// Z-index layers for consistent stacking
export const Z_INDEX = {
  /** Base content layer */
  BASE: 0,
  /** Floating elements */
  FLOATING: 10,
  /** Navigation bar */
  NAVBAR: 40,
  /** Scroll progress bar */
  PROGRESS_BAR: 50,
  /** Loading screen */
  LOADING: 100,
  /** Custom cursor (highest) */
  CURSOR: 9999,
} as const;

// Color palette (matches Tailwind theme)
export const COLORS = {
  NEON_BLUE: "#00f0ff",
  NEON_PURPLE: "#b829ff",
  NEON_PINK: "#ff2e97",
  PRIMARY_PURPLE: "#8b5cf6",
  PRIMARY_BLUE: "#3b82f6",
  PRIMARY_INDIGO: "#6366f1",
} as const;

// Type exports for use in components
export type AnimationConfig = typeof ANIMATION;
export type ParticleConfig = typeof PARTICLES;
export type BreakpointConfig = typeof BREAKPOINTS;
