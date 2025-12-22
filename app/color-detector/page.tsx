import ColorDetector from "@/components/ColorDetector";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colour Detector - Extract Colours from Images | Dylan Portfolio",
  description: "Upload an image and detect colours instantly. Get hex codes, RGB values, colour names, and dominant colour palettes. Built with React, TypeScript, and Canvas API.",
  keywords: ["colour detector", "colour picker", "image colour extraction", "hex colour", "RGB colour", "colour palette generator"],
  openGraph: {
    title: "Colour Detector - Extract Colours from Images",
    description: "Upload an image and detect colours instantly. Get hex codes, RGB values, and colour palettes.",
    type: "website",
  },
};

export default function ColorDetectorPage() {
  return <ColorDetector />;
}
