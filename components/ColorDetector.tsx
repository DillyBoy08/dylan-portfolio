"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiCopy, FiCheck, FiX } from "react-icons/fi";

// TypeScript Interfaces
interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ColorInfo {
  hex: string;
  rgb: RGB;
  name: string;
}

interface DominantColor extends ColorInfo {
  percentage: number;
}

// Color Name Dictionary (140+ standard HTML/CSS colors)
const COLOR_NAMES: Record<string, RGB> = {
  AliceBlue: { r: 240, g: 248, b: 255 },
  AntiqueWhite: { r: 250, g: 235, b: 215 },
  Aqua: { r: 0, g: 255, b: 255 },
  Aquamarine: { r: 127, g: 255, b: 212 },
  Azure: { r: 240, g: 255, b: 255 },
  Beige: { r: 245, g: 245, b: 220 },
  Bisque: { r: 255, g: 228, b: 196 },
  Black: { r: 0, g: 0, b: 0 },
  BlanchedAlmond: { r: 255, g: 235, b: 205 },
  Blue: { r: 0, g: 0, b: 255 },
  BlueViolet: { r: 138, g: 43, b: 226 },
  Brown: { r: 165, g: 42, b: 42 },
  BurlyWood: { r: 222, g: 184, b: 135 },
  CadetBlue: { r: 95, g: 158, b: 160 },
  Chartreuse: { r: 127, g: 255, b: 0 },
  Chocolate: { r: 210, g: 105, b: 30 },
  Coral: { r: 255, g: 127, b: 80 },
  CornflowerBlue: { r: 100, g: 149, b: 237 },
  Cornsilk: { r: 255, g: 248, b: 220 },
  Crimson: { r: 220, g: 20, b: 60 },
  Cyan: { r: 0, g: 255, b: 255 },
  DarkBlue: { r: 0, g: 0, b: 139 },
  DarkCyan: { r: 0, g: 139, b: 139 },
  DarkGoldenRod: { r: 184, g: 134, b: 11 },
  DarkGray: { r: 169, g: 169, b: 169 },
  DarkGreen: { r: 0, g: 100, b: 0 },
  DarkKhaki: { r: 189, g: 183, b: 107 },
  DarkMagenta: { r: 139, g: 0, b: 139 },
  DarkOliveGreen: { r: 85, g: 107, b: 47 },
  DarkOrange: { r: 255, g: 140, b: 0 },
  DarkOrchid: { r: 153, g: 50, b: 204 },
  DarkRed: { r: 139, g: 0, b: 0 },
  DarkSalmon: { r: 233, g: 150, b: 122 },
  DarkSeaGreen: { r: 143, g: 188, b: 143 },
  DarkSlateBlue: { r: 72, g: 61, b: 139 },
  DarkSlateGray: { r: 47, g: 79, b: 79 },
  DarkTurquoise: { r: 0, g: 206, b: 209 },
  DarkViolet: { r: 148, g: 0, b: 211 },
  DeepPink: { r: 255, g: 20, b: 147 },
  DeepSkyBlue: { r: 0, g: 191, b: 255 },
  DimGray: { r: 105, g: 105, b: 105 },
  DodgerBlue: { r: 30, g: 144, b: 255 },
  FireBrick: { r: 178, g: 34, b: 34 },
  FloralWhite: { r: 255, g: 250, b: 240 },
  ForestGreen: { r: 34, g: 139, b: 34 },
  Fuchsia: { r: 255, g: 0, b: 255 },
  Gainsboro: { r: 220, g: 220, b: 220 },
  GhostWhite: { r: 248, g: 248, b: 255 },
  Gold: { r: 255, g: 215, b: 0 },
  GoldenRod: { r: 218, g: 165, b: 32 },
  Gray: { r: 128, g: 128, b: 128 },
  Green: { r: 0, g: 128, b: 0 },
  GreenYellow: { r: 173, g: 255, b: 47 },
  HoneyDew: { r: 240, g: 255, b: 240 },
  HotPink: { r: 255, g: 105, b: 180 },
  IndianRed: { r: 205, g: 92, b: 92 },
  Indigo: { r: 75, g: 0, b: 130 },
  Ivory: { r: 255, g: 255, b: 240 },
  Khaki: { r: 240, g: 230, b: 140 },
  Lavender: { r: 230, g: 230, b: 250 },
  LavenderBlush: { r: 255, g: 240, b: 245 },
  LawnGreen: { r: 124, g: 252, b: 0 },
  LemonChiffon: { r: 255, g: 250, b: 205 },
  LightBlue: { r: 173, g: 216, b: 230 },
  LightCoral: { r: 240, g: 128, b: 128 },
  LightCyan: { r: 224, g: 255, b: 255 },
  LightGoldenRodYellow: { r: 250, g: 250, b: 210 },
  LightGray: { r: 211, g: 211, b: 211 },
  LightGreen: { r: 144, g: 238, b: 144 },
  LightPink: { r: 255, g: 182, b: 193 },
  LightSalmon: { r: 255, g: 160, b: 122 },
  LightSeaGreen: { r: 32, g: 178, b: 170 },
  LightSkyBlue: { r: 135, g: 206, b: 250 },
  LightSlateGray: { r: 119, g: 136, b: 153 },
  LightSteelBlue: { r: 176, g: 196, b: 222 },
  LightYellow: { r: 255, g: 255, b: 224 },
  Lime: { r: 0, g: 255, b: 0 },
  LimeGreen: { r: 50, g: 205, b: 50 },
  Linen: { r: 250, g: 240, b: 230 },
  Magenta: { r: 255, g: 0, b: 255 },
  Maroon: { r: 128, g: 0, b: 0 },
  MediumAquaMarine: { r: 102, g: 205, b: 170 },
  MediumBlue: { r: 0, g: 0, b: 205 },
  MediumOrchid: { r: 186, g: 85, b: 211 },
  MediumPurple: { r: 147, g: 112, b: 219 },
  MediumSeaGreen: { r: 60, g: 179, b: 113 },
  MediumSlateBlue: { r: 123, g: 104, b: 238 },
  MediumSpringGreen: { r: 0, g: 250, b: 154 },
  MediumTurquoise: { r: 72, g: 209, b: 204 },
  MediumVioletRed: { r: 199, g: 21, b: 133 },
  MidnightBlue: { r: 25, g: 25, b: 112 },
  MintCream: { r: 245, g: 255, b: 250 },
  MistyRose: { r: 255, g: 228, b: 225 },
  Moccasin: { r: 255, g: 228, b: 181 },
  NavajoWhite: { r: 255, g: 222, b: 173 },
  Navy: { r: 0, g: 0, b: 128 },
  OldLace: { r: 253, g: 245, b: 230 },
  Olive: { r: 128, g: 128, b: 0 },
  OliveDrab: { r: 107, g: 142, b: 35 },
  Orange: { r: 255, g: 165, b: 0 },
  OrangeRed: { r: 255, g: 69, b: 0 },
  Orchid: { r: 218, g: 112, b: 214 },
  PaleGoldenRod: { r: 238, g: 232, b: 170 },
  PaleGreen: { r: 152, g: 251, b: 152 },
  PaleTurquoise: { r: 175, g: 238, b: 238 },
  PaleVioletRed: { r: 219, g: 112, b: 147 },
  PapayaWhip: { r: 255, g: 239, b: 213 },
  PeachPuff: { r: 255, g: 218, b: 185 },
  Peru: { r: 205, g: 133, b: 63 },
  Pink: { r: 255, g: 192, b: 203 },
  Plum: { r: 221, g: 160, b: 221 },
  PowderBlue: { r: 176, g: 224, b: 230 },
  Purple: { r: 128, g: 0, b: 128 },
  RebeccaPurple: { r: 102, g: 51, b: 153 },
  Red: { r: 255, g: 0, b: 0 },
  RosyBrown: { r: 188, g: 143, b: 143 },
  RoyalBlue: { r: 65, g: 105, b: 225 },
  SaddleBrown: { r: 139, g: 69, b: 19 },
  Salmon: { r: 250, g: 128, b: 114 },
  SandyBrown: { r: 244, g: 164, b: 96 },
  SeaGreen: { r: 46, g: 139, b: 87 },
  SeaShell: { r: 255, g: 245, b: 238 },
  Sienna: { r: 160, g: 82, b: 45 },
  Silver: { r: 192, g: 192, b: 192 },
  SkyBlue: { r: 135, g: 206, b: 235 },
  SlateBlue: { r: 106, g: 90, b: 205 },
  SlateGray: { r: 112, g: 128, b: 144 },
  Snow: { r: 255, g: 250, b: 250 },
  SpringGreen: { r: 0, g: 255, b: 127 },
  SteelBlue: { r: 70, g: 130, b: 180 },
  Tan: { r: 210, g: 180, b: 140 },
  Teal: { r: 0, g: 128, b: 128 },
  Thistle: { r: 216, g: 191, b: 216 },
  Tomato: { r: 255, g: 99, b: 71 },
  Turquoise: { r: 64, g: 224, b: 208 },
  Violet: { r: 238, g: 130, b: 238 },
  Wheat: { r: 245, g: 222, b: 179 },
  White: { r: 255, g: 255, b: 255 },
  WhiteSmoke: { r: 245, g: 245, b: 245 },
  Yellow: { r: 255, g: 255, b: 0 },
  YellowGreen: { r: 154, g: 205, b: 50 },
};

// Utility Functions
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const colorDistance = (c1: RGB, c2: RGB): number => {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
};

const getColorName = (rgb: RGB): string => {
  let minDistance = Infinity;
  let closestColorName = "Unknown";

  for (const [name, colorRgb] of Object.entries(COLOR_NAMES)) {
    const distance = colorDistance(rgb, colorRgb);
    if (distance < minDistance) {
      minDistance = distance;
      closestColorName = name;
    }
  }

  return closestColorName;
};

const extractDominantColors = (
  canvas: HTMLCanvasElement,
  count: number = 10
): DominantColor[] => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const colorMap = new Map<string, { rgb: RGB; count: number }>();
  let totalPixels = 0;

  // Sample every 5th pixel for performance
  for (let i = 0; i < pixels.length; i += 4 * 5) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const alpha = pixels[i + 3];

    // Skip transparent pixels
    if (alpha < 125) continue;

    // Round to nearest 10 to group similar colors
    const roundedR = Math.round(r / 10) * 10;
    const roundedG = Math.round(g / 10) * 10;
    const roundedB = Math.round(b / 10) * 10;

    const key = `${roundedR},${roundedG},${roundedB}`;
    totalPixels++;

    if (colorMap.has(key)) {
      colorMap.get(key)!.count++;
    } else {
      colorMap.set(key, {
        rgb: { r: roundedR, g: roundedG, b: roundedB },
        count: 1,
      });
    }
  }

  // Sort by frequency and return top N
  const sortedColors = Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, count);

  return sortedColors.map((color) => {
    const hex = rgbToHex(color.rgb.r, color.rgb.g, color.rgb.b);
    const name = getColorName(color.rgb);
    const percentage = (color.count / totalPixels) * 100;

    return {
      hex,
      rgb: color.rgb,
      name,
      percentage,
    };
  });
};

export default function ColorDetector() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);
  const [dominantColors, setDominantColors] = useState<DominantColor[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Process image and extract dominant colors
  const processImage = (imageSrc: string) => {
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size to image size (with max dimensions for performance)
      const maxDimension = 1000;
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Extract dominant colors
      const colors = extractDominantColors(canvas, 10);
      setDominantColors(colors);
      setIsProcessing(false);
    };

    img.onerror = () => {
      setError("Failed to load image. Please try another file.");
      setIsProcessing(false);
    };

    img.src = imageSrc;
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      processImage(result);
      setSelectedColor(null);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  // Handle canvas click to detect color
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const rgb: RGB = { r: pixel[0], g: pixel[1], b: pixel[2] };
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const name = getColorName(rgb);

    setSelectedColor({ rgb, hex, name });
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedValue(type);
      setTimeout(() => setCopiedValue(null), 2000);
    } catch (err) {
      // Silently fail - user will notice copy didn't work
    }
  };

  // Clear image
  const handleClear = () => {
    setUploadedImage(null);
    setSelectedColor(null);
    setDominantColors([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-xl font-medium text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950 py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Colour Detector
            </h1>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Click anywhere on an image to extract its colours
          </p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg flex items-center justify-between"
            >
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                <FiX size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Zone */}
        {!uploadedImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group relative border-2 border-dashed rounded-2xl p-20 text-center transition-all overflow-hidden ${
              isDragging
                ? "border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/30 scale-[1.02]"
                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-950/20 dark:hover:to-pink-950/20"
            }`}
          >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-purple-500/5 dark:group-hover:from-purple-500/10 dark:group-hover:via-pink-500/10 dark:group-hover:to-purple-500/10 transition-all duration-500 -z-10" />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/20 transition-all"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FiUpload size={28} className="text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Upload an image
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                or drag and drop here
              </p>
            </label>
          </motion.div>
        )}

        {/* Image Display Area */}
        {uploadedImage && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Click anywhere on the image
                </p>
                <button
                  onClick={handleClear}
                  className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors font-medium"
                >
                  Clear
                </button>
              </div>

              <div className="relative inline-block max-w-full">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="max-w-full h-auto rounded-xl cursor-crosshair border-2 border-gray-200 dark:border-gray-700 shadow-xl"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-900 px-6 py-3 rounded-lg shadow-xl">
                      <div className="text-gray-900 dark:text-white text-sm font-semibold">
                        Processing...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Selected Color Display */}
            <AnimatePresence mode="wait">
              {selectedColor && (
                <motion.div
                  key={selectedColor.hex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900/50 shadow-lg overflow-hidden"
                >
                  {/* Subtle gradient background based on selected color */}
                  <div
                    className="absolute inset-0 opacity-5 dark:opacity-10 -z-10 blur-3xl"
                    style={{ backgroundColor: selectedColor.hex }}
                  />

                  <div className="grid md:grid-cols-[320px_1fr] gap-8">
                    {/* Color Swatch */}
                    <div className="space-y-4">
                      <motion.div
                        className="relative w-full h-48 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        style={{ backgroundColor: selectedColor.hex }}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                      </motion.div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {selectedColor.name}
                        </div>
                      </div>
                    </div>

                    {/* Color Info */}
                    <div className="space-y-1">
                      {/* Hex */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold w-12">
                            Hex
                          </span>
                          <code className="text-base font-mono text-gray-900 dark:text-white font-medium">
                            {selectedColor.hex}
                          </code>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(selectedColor.hex, "hex")
                          }
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          {copiedValue === "hex" ? (
                            <FiCheck className="text-green-500" size={18} />
                          ) : (
                            <FiCopy className="text-gray-400" size={18} />
                          )}
                        </button>
                      </motion.div>

                      {/* RGB */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="group flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold w-12">
                            RGB
                          </span>
                          <code className="text-base font-mono text-gray-900 dark:text-white font-medium">
                            {selectedColor.rgb.r}, {selectedColor.rgb.g},{" "}
                            {selectedColor.rgb.b}
                          </code>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `rgb(${selectedColor.rgb.r}, ${selectedColor.rgb.g}, ${selectedColor.rgb.b})`,
                              "rgb"
                            )
                          }
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          {copiedValue === "rgb" ? (
                            <FiCheck className="text-green-500" size={18} />
                          ) : (
                            <FiCopy className="text-gray-400" size={18} />
                          )}
                        </button>
                      </motion.div>

                      {/* RGB Channels */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-3 gap-3 pt-4"
                      >
                        <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30">
                          <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
                            Red
                          </div>
                          <div className="text-3xl font-bold text-red-700 dark:text-red-300 tabular-nums">
                            {selectedColor.rgb.r}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/30">
                          <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
                            Green
                          </div>
                          <div className="text-3xl font-bold text-green-700 dark:text-green-300 tabular-nums">
                            {selectedColor.rgb.g}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30">
                          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                            Blue
                          </div>
                          <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 tabular-nums">
                            {selectedColor.rgb.b}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dominant Colors Palette */}
            {dominantColors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900/50 shadow-lg"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Color Palette
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {dominantColors.length} colors
                  </span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  {dominantColors.map((color, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className="group relative aspect-square"
                      title={`${color.hex} - ${color.percentage.toFixed(1)}%`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.15, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="w-full h-full rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-md group-hover:shadow-xl transition-shadow"
                        style={{ backgroundColor: color.hex }}
                      />
                      {/* Tooltip on hover */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                        {color.percentage.toFixed(1)}%
                      </div>
                    </motion.button>
                  ))}
                </div>
                <div className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">
                  Click a color to view details
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
