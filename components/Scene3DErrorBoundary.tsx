"use client";

import React from "react";

interface Scene3DErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface Scene3DErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Specialized error boundary for 3D/WebGL components.
 * Gracefully handles WebGL failures and provides a fallback UI.
 */
export class Scene3DErrorBoundary extends React.Component<
  Scene3DErrorBoundaryProps,
  Scene3DErrorBoundaryState
> {
  constructor(props: Scene3DErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Scene3DErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log WebGL/3D specific errors
    console.error("3D Scene Error:", error, errorInfo);

    // Check if it's a WebGL-specific error
    const isWebGLError =
      error.message.toLowerCase().includes("webgl") ||
      error.message.toLowerCase().includes("three") ||
      error.message.toLowerCase().includes("canvas") ||
      error.message.toLowerCase().includes("renderer");

    if (isWebGLError) {
      console.warn(
        "WebGL may not be supported or is disabled in this browser."
      );
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback for 3D scenes
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
          <div className="text-center px-6 py-8 max-w-md">
            <div className="text-5xl mb-4" aria-hidden="true">
              🎨
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              3D Experience Unavailable
            </h2>
            <p className="text-gray-400 mb-4">
              The 3D visualization couldn&apos;t load. This might be due to
              browser compatibility or graphics settings.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Try:</p>
              <ul className="list-disc list-inside text-left">
                <li>Enabling hardware acceleration in your browser</li>
                <li>Updating your graphics drivers</li>
                <li>Using a different browser (Chrome/Firefox recommended)</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
