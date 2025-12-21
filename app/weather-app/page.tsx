import WeatherApp from "@/components/WeatherApp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weather App - Real-time Weather Forecasts | Dylan Portfolio",
  description: "Get real-time weather forecasts with beautiful 3D visualizations. Features 5-day forecasts, city search, current conditions, and more. Built with React, TypeScript, Three.js, and OpenWeather API.",
  keywords: ["weather app", "weather forecast", "real-time weather", "3D weather visualization", "OpenWeather API", "React weather app"],
  openGraph: {
    title: "Weather App - Real-time Weather Forecasts",
    description: "Get real-time weather forecasts with beautiful 3D visualizations and 5-day forecasts.",
    type: "website",
  },
};

export default function WeatherAppPage() {
  return <WeatherApp />;
}
