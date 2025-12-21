import ColorDetector from "@/components/ColorDetector";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Detector - Extract Colors from Images | Dylan Portfolio",
  description: "Upload an image and detect colors instantly. Get hex codes, RGB values, color names, and dominant color palettes. Built with React, TypeScript, and Canvas API.",
  keywords: ["color detector", "color picker", "image color extraction", "hex color", "RGB color", "color palette generator"],
  openGraph: {
    title: "Color Detector - Extract Colors from Images",
    description: "Upload an image and detect colors instantly. Get hex codes, RGB values, and color palettes.",
    type: "website",
  },
};

export default function ColorDetectorPage() {
  return <ColorDetector />;
}
