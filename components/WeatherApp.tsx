"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiDust,
  WiNightClear
} from "react-icons/wi";
import {
  TbWorldWww,
  TbBolt,
  TbChartBar,
  TbCloudDataConnection,
  TbArrowLeft
} from "react-icons/tb";
import Link from "next/link";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  pressure: number;
  visibility: number;
  cloudiness: number;
  icon: string;
  sunrise: number;
  sunset: number;
  main: string;
  tempMin: number;
  tempMax: number;
  rain1h?: number;
  rain3h?: number;
}

interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  pop: number;
  date: string;
  day: string;
  rain?: number;
}

interface DailyForecast {
  date: string;
  day: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rain?: number;
}

interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  displayName: string;
}

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentCoords, setCurrentCoords] = useState<{lat: number, lon: number} | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [showIntro, setShowIntro] = useState(true);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Performance optimizations
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  // Reduce particle count on mobile
  const particleCount = useMemo(() => {
    if (prefersReducedMotion) return { rain: 0, snow: 0, thunderstorm: 0 };
    if (isMobile) return {
      rain: 15,
      snow: 10,
      thunderstorm: 20,
    };
    return {
      rain: 40,
      snow: 30,
      thunderstorm: 50,
    };
  }, [isMobile, prefersReducedMotion]);

  const improveWeatherDescription = useCallback((description: string): string => {
    const descriptionMap: Record<string, string> = {
      'broken clouds': 'mostly cloudy',
      'scattered clouds': 'partly cloudy',
      'few clouds': 'partly sunny',
      'overcast clouds': 'cloudy',
      'clear sky': 'clear',
      'light rain': 'light showers',
      'moderate rain': 'rain',
      'heavy intensity rain': 'heavy rain',
      'very heavy rain': 'heavy rain',
      'extreme rain': 'intense rain',
    };

    return descriptionMap[description.toLowerCase()] || description;
  }, []);

  const processWeatherData = useCallback((data: any) => {
    const currentData = data.current;
    const forecastData = data.forecast;

    setWeather({
      city: selectedCityName || currentData.name,
      country: currentData.sys.country,
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      description: improveWeatherDescription(currentData.weather[0].description),
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind.speed,
      windDeg: currentData.wind.deg,
      pressure: currentData.main.pressure,
      visibility: currentData.visibility / 1000,
      cloudiness: currentData.clouds.all,
      icon: currentData.weather[0].icon,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
      main: currentData.weather[0].main.toLowerCase(),
      tempMin: Math.round(currentData.main.temp_min),
      tempMax: Math.round(currentData.main.temp_max),
      rain1h: currentData.rain?.['1h'],
      rain3h: currentData.rain?.['3h'],
    });

    if (forecastData && forecastData.list) {
      const hourly = forecastData.list.map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        }),
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        pop: Math.round(item.pop * 100),
        date: new Date(item.dt * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        day: new Date(item.dt * 1000).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        rain: item.rain?.['3h'] || 0,
      }));
      setHourlyForecast(hourly);

      const dailyMap = new Map<string, any>();
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date: new Date(item.dt * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            day: new Date(item.dt * 1000).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            temps: [item.main.temp],
            description: improveWeatherDescription(item.weather[0].description),
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
            rain: item.rain?.['3h'] || 0,
          });
        } else {
          const existing = dailyMap.get(date);
          existing.temps.push(item.main.temp);
          existing.rain = (existing.rain || 0) + (item.rain?.['3h'] || 0);
        }
      });

      const daily = Array.from(dailyMap.values())
        .slice(0, 7)
        .map((day: any) => ({
          ...day,
          temp: Math.round(day.temps.reduce((a: number, b: number) => a + b) / day.temps.length),
          tempMin: Math.round(Math.min(...day.temps)),
          tempMax: Math.round(Math.max(...day.temps)),
        }));

      setDailyForecast(daily);
    }
  }, [selectedCityName, improveWeatherDescription]);

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError("");
    setCurrentCoords({ lat, lon });

    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}&unit=${unit}`);

      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }

      const data = await response.json();
      processWeatherData(data);
    } catch (err) {
      setError("Failed to get weather for your location");
      setCurrentCoords(null);
    } finally {
      setLoading(false);
    }
  }, [unit, processWeatherData]);

  const fetchWeather = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(cityName)}&unit=${unit}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "City not found");
      }

      const data = await response.json();
      processWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
      setWeather(null);
      setHourlyForecast([]);
      setDailyForecast([]);
    } finally {
      setLoading(false);
    }
  }, [unit, processWeatherData]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedCityName("");
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setSelectedCityName("Durbanville");
          fetchWeather("Durbanville");
        }
      );
    } else {
      setSelectedCityName("Durbanville");
      fetchWeather("Durbanville");
    }
  }, [fetchWeatherByCoords, fetchWeather]);

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    setCity(suggestion.name);
    setSelectedCityName(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    fetchWeatherByCoords(suggestion.lat, suggestion.lon);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          fetchWeather(city);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      handleSuggestionClick(suggestions[selectedIndex]);
    } else {
      setSelectedCityName(city);
      fetchWeather(city);
      setShowSuggestions(false);
    }
  };

  const getWeatherIcon = (iconCode: string, main?: string, isNight?: boolean) => {
    // For forecasts, convert night codes to day codes
    let displayCode = iconCode;
    if (isNight === false && iconCode.endsWith('n')) {
      displayCode = iconCode.replace('n', 'd');
    }

    // Map weather conditions to appropriate icons
    const weatherCondition = main?.toLowerCase();

    // Check if it's nighttime (only for current weather)
    const showNightIcon = isNight && (weatherCondition === 'clear' || displayCode.startsWith('01') || displayCode.startsWith('02'));

    const iconMap: Record<string, string> = {
      // Clear
      '01d': '☀️',
      '01n': showNightIcon ? '🌙' : '☀️',
      // Clouds
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      // Rain
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      // Thunderstorm
      '11d': '⛈️',
      '11n': '⛈️',
      // Snow
      '13d': '❄️',
      '13n': '❄️',
      // Atmosphere
      '50d': '🌫️',
      '50n': '🌫️',
    };

    // Check main weather condition as fallback
    if (!iconMap[displayCode] && weatherCondition) {
      const conditionMap: Record<string, string> = {
        'clear': showNightIcon ? '🌙' : '☀️',
        'clouds': '☁️',
        'rain': '🌧️',
        'drizzle': '🌦️',
        'thunderstorm': '⛈️',
        'snow': '❄️',
        'mist': '🌫️',
        'fog': '🌫️',
        'haze': '🌫️',
        'smoke': '💨',
        'dust': '💨',
      };
      return conditionMap[weatherCondition] || '🌤️';
    }

    return iconMap[displayCode] || '🌤️';
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWindDirection = (deg: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    if (currentCoords) {
      setTimeout(() => fetchWeatherByCoords(currentCoords.lat, currentCoords.lon), 100);
    } else if (weather) {
      setTimeout(() => fetchWeather(weather.city), 100);
    }
  };

  const getBackgroundGradient = () => {
    return "bg-white dark:bg-slate-950";
  };

  useEffect(() => {
    getCurrentLocation();
    // Hide intro animation after 3 seconds
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, [getCurrentLocation]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(city)}`);
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(data.suggestions && data.suggestions.length > 0);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [city]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`min-h-screen ${getBackgroundGradient()} transition-colors duration-1000 relative`}>
      {/* Opening Clouds Animation */}
      <AnimatePresence>
        {showIntro && !isMobile && !prefersReducedMotion && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Sky Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-300 to-blue-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 2.5 }}
            />

            {/* Left Cloud Half - wider to ensure full coverage */}
            <motion.div
              className="absolute inset-0 w-[85%]"
              style={{
                left: 0,
                right: 'auto',
                maskImage: 'linear-gradient(to right, white 0%, white 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, white 0%, white 80%, transparent 100%)',
              }}
              initial={{ x: "0%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.5, delay: 1, ease: [0.6, 0.01, 0.05, 0.95] }}
            >
              <svg
                viewBox="0 0 1000 1000"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Realistic cloud gradient with shadows */}
                  <radialGradient id="cloudGradientLeft1" cx="50%" cy="30%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="70%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </radialGradient>
                  <radialGradient id="cloudGradientLeft2" cx="50%" cy="40%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#f1f5f9" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </radialGradient>
                  <radialGradient id="cloudGradientLeft3" cx="40%" cy="50%">
                    <stop offset="0%" stopColor="#fefefe" />
                    <stop offset="80%" stopColor="#e8eef5" />
                    <stop offset="100%" stopColor="#d1dae6" />
                  </radialGradient>
                  {/* Blur filter for soft cloud edges */}
                  <filter id="cloudBlur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                  </filter>
                  <filter id="cloudBlurSoft">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
                  </filter>
                </defs>

                {/* Background layer - biggest puffs */}
                <g filter="url(#cloudBlurSoft)">
                  <motion.ellipse
                    cx="150"
                    cy="280"
                    rx="220"
                    ry="160"
                    fill="url(#cloudGradientLeft1)"
                    opacity="0.85"
                    animate={{
                      cy: [280, 270, 280],
                      rx: [220, 235, 220],
                      ry: [160, 170, 160],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="450"
                    cy="320"
                    rx="280"
                    ry="180"
                    fill="url(#cloudGradientLeft2)"
                    opacity="0.8"
                    animate={{
                      cy: [320, 310, 320],
                      rx: [280, 295, 280],
                      ry: [180, 190, 180],
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="780"
                    cy="300"
                    rx="250"
                    ry="170"
                    fill="url(#cloudGradientLeft1)"
                    opacity="0.83"
                    animate={{
                      cy: [300, 290, 300],
                      rx: [250, 265, 250],
                      ry: [170, 180, 170],
                    }}
                    transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="50"
                    cy="350"
                    rx="200"
                    ry="150"
                    fill="url(#cloudGradientLeft2)"
                    opacity="0.78"
                    animate={{
                      cy: [350, 340, 350],
                      rx: [200, 215, 200],
                      ry: [150, 160, 150],
                    }}
                    transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="620"
                    cy="270"
                    rx="240"
                    ry="165"
                    fill="url(#cloudGradientLeft1)"
                    opacity="0.82"
                    animate={{
                      cy: [270, 260, 270],
                      rx: [240, 255, 240],
                      ry: [165, 175, 165],
                    }}
                    transition={{ duration: 6.3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="920"
                    cy="330"
                    rx="230"
                    ry="160"
                    fill="url(#cloudGradientLeft2)"
                    opacity="0.81"
                    animate={{
                      cy: [330, 320, 330],
                      rx: [230, 245, 230],
                      ry: [160, 170, 160],
                    }}
                    transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </g>

                {/* Middle layer - medium puffs */}
                <g filter="url(#cloudBlur)">
                  <motion.ellipse
                    cx="280"
                    cy="350"
                    rx="200"
                    ry="140"
                    fill="url(#cloudGradientLeft2)"
                    opacity="0.9"
                    animate={{
                      cy: [350, 340, 350],
                      rx: [200, 215, 200],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="580"
                    cy="380"
                    rx="230"
                    ry="150"
                    fill="url(#cloudGradientLeft3)"
                    opacity="0.92"
                    animate={{
                      cy: [380, 370, 380],
                      rx: [230, 245, 230],
                    }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="850"
                    cy="360"
                    rx="210"
                    ry="145"
                    fill="url(#cloudGradientLeft2)"
                    opacity="0.88"
                    animate={{
                      cy: [360, 350, 360],
                      rx: [210, 225, 210],
                    }}
                    transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="120"
                    cy="360"
                    rx="190"
                    ry="135"
                    fill="url(#cloudGradientLeft3)"
                    opacity="0.87"
                    animate={{
                      cy: [360, 350, 360],
                      rx: [190, 205, 190],
                    }}
                    transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="440"
                    cy="340"
                    rx="210"
                    ry="145"
                    fill="url(#cloudGradientLeft2)"
                    opacity="0.91"
                    animate={{
                      cy: [340, 330, 340],
                      rx: [210, 225, 210],
                    }}
                    transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="720"
                    cy="370"
                    rx="220"
                    ry="148"
                    fill="url(#cloudGradientLeft3)"
                    opacity="0.89"
                    animate={{
                      cy: [370, 360, 370],
                      rx: [220, 235, 220],
                    }}
                    transition={{ duration: 5.3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </g>

                {/* Top layer - detailed smaller puffs */}
                <g filter="url(#cloudBlur)">
                  <motion.ellipse
                    cx="100"
                    cy="380"
                    rx="150"
                    ry="100"
                    fill="#ffffff"
                    opacity="0.95"
                    animate={{
                      cy: [380, 370, 380],
                      rx: [150, 160, 150],
                    }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="350"
                    cy="410"
                    rx="170"
                    ry="110"
                    fill="#ffffff"
                    opacity="0.97"
                    animate={{
                      cy: [410, 400, 410],
                      rx: [170, 180, 170],
                    }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="620"
                    cy="420"
                    rx="190"
                    ry="120"
                    fill="#ffffff"
                    opacity="0.96"
                    animate={{
                      cy: [420, 410, 420],
                      rx: [190, 200, 190],
                    }}
                    transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="890"
                    cy="400"
                    rx="160"
                    ry="105"
                    fill="#ffffff"
                    opacity="0.94"
                    animate={{
                      cy: [400, 390, 400],
                      rx: [160, 170, 160],
                    }}
                    transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="220"
                    cy="395"
                    rx="145"
                    ry="95"
                    fill="#ffffff"
                    opacity="0.96"
                    animate={{
                      cy: [395, 385, 395],
                      rx: [145, 155, 145],
                    }}
                    transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="490"
                    cy="425"
                    rx="165"
                    ry="108"
                    fill="#ffffff"
                    opacity="0.98"
                    animate={{
                      cy: [425, 415, 425],
                      rx: [165, 175, 165],
                    }}
                    transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="760"
                    cy="410"
                    rx="155"
                    ry="102"
                    fill="#ffffff"
                    opacity="0.95"
                    animate={{
                      cy: [410, 400, 410],
                      rx: [155, 165, 155],
                    }}
                    transition={{ duration: 4.3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="980"
                    cy="390"
                    rx="140"
                    ry="93"
                    fill="#ffffff"
                    opacity="0.93"
                    animate={{
                      cy: [390, 380, 390],
                      rx: [140, 150, 140],
                    }}
                    transition={{ duration: 4.65, repeat: Infinity, ease: "easeInOut" }}
                  />
                </g>

                {/* Base coverage - ensures no gaps */}
                <rect x="0" y="0" width="1000" height="1000" fill="url(#cloudGradientLeft3)" opacity="0.7" />
              </svg>
            </motion.div>

            {/* Right Cloud Half - wider to ensure full coverage */}
            <motion.div
              className="absolute inset-0 w-[85%]"
              style={{
                right: 0,
                left: 'auto',
                maskImage: 'linear-gradient(to left, white 0%, white 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to left, white 0%, white 80%, transparent 100%)',
              }}
              initial={{ x: "0%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, delay: 1, ease: [0.6, 0.01, 0.05, 0.95] }}
            >
              <svg
                viewBox="0 0 1000 1000"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Realistic cloud gradient with shadows */}
                  <radialGradient id="cloudGradientRight1" cx="50%" cy="30%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="70%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </radialGradient>
                  <radialGradient id="cloudGradientRight2" cx="50%" cy="40%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#f1f5f9" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </radialGradient>
                  <radialGradient id="cloudGradientRight3" cx="40%" cy="50%">
                    <stop offset="0%" stopColor="#fefefe" />
                    <stop offset="80%" stopColor="#e8eef5" />
                    <stop offset="100%" stopColor="#d1dae6" />
                  </radialGradient>
                </defs>

                {/* Background layer - biggest puffs */}
                <g filter="url(#cloudBlurSoft)">
                  <motion.ellipse
                    cx="850"
                    cy="280"
                    rx="220"
                    ry="160"
                    fill="url(#cloudGradientRight1)"
                    opacity="0.85"
                    animate={{
                      cy: [280, 270, 280],
                      rx: [220, 235, 220],
                      ry: [160, 170, 160],
                    }}
                    transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="550"
                    cy="320"
                    rx="280"
                    ry="180"
                    fill="url(#cloudGradientRight2)"
                    opacity="0.8"
                    animate={{
                      cy: [320, 310, 320],
                      rx: [280, 295, 280],
                      ry: [180, 190, 180],
                    }}
                    transition={{ duration: 7.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="220"
                    cy="300"
                    rx="250"
                    ry="170"
                    fill="url(#cloudGradientRight1)"
                    opacity="0.83"
                    animate={{
                      cy: [300, 290, 300],
                      rx: [250, 265, 250],
                      ry: [170, 180, 170],
                    }}
                    transition={{ duration: 6.7, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="950"
                    cy="350"
                    rx="200"
                    ry="150"
                    fill="url(#cloudGradientRight2)"
                    opacity="0.78"
                    animate={{
                      cy: [350, 340, 350],
                      rx: [200, 215, 200],
                      ry: [150, 160, 150],
                    }}
                    transition={{ duration: 6.9, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="380"
                    cy="270"
                    rx="240"
                    ry="165"
                    fill="url(#cloudGradientRight1)"
                    opacity="0.82"
                    animate={{
                      cy: [270, 260, 270],
                      rx: [240, 255, 240],
                      ry: [165, 175, 165],
                    }}
                    transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="80"
                    cy="330"
                    rx="230"
                    ry="160"
                    fill="url(#cloudGradientRight2)"
                    opacity="0.81"
                    animate={{
                      cy: [330, 320, 330],
                      rx: [230, 245, 230],
                      ry: [160, 170, 160],
                    }}
                    transition={{ duration: 6.75, repeat: Infinity, ease: "easeInOut" }}
                  />
                </g>

                {/* Middle layer - medium puffs */}
                <g filter="url(#cloudBlur)">
                  <motion.ellipse
                    cx="720"
                    cy="350"
                    rx="200"
                    ry="140"
                    fill="url(#cloudGradientRight2)"
                    opacity="0.9"
                    animate={{
                      cy: [350, 340, 350],
                      rx: [200, 215, 200],
                    }}
                    transition={{ duration: 5.3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="420"
                    cy="380"
                    rx="230"
                    ry="150"
                    fill="url(#cloudGradientRight3)"
                    opacity="0.92"
                    animate={{
                      cy: [380, 370, 380],
                      rx: [230, 245, 230],
                    }}
                    transition={{ duration: 5.7, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="150"
                    cy="360"
                    rx="210"
                    ry="145"
                    fill="url(#cloudGradientRight2)"
                    opacity="0.88"
                    animate={{
                      cy: [360, 350, 360],
                      rx: [210, 225, 210],
                    }}
                    transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="880"
                    cy="360"
                    rx="190"
                    ry="135"
                    fill="url(#cloudGradientRight3)"
                    opacity="0.87"
                    animate={{
                      cy: [360, 350, 360],
                      rx: [190, 205, 190],
                    }}
                    transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="560"
                    cy="340"
                    rx="210"
                    ry="145"
                    fill="url(#cloudGradientRight2)"
                    opacity="0.91"
                    animate={{
                      cy: [340, 330, 340],
                      rx: [210, 225, 210],
                    }}
                    transition={{ duration: 5.25, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="280"
                    cy="370"
                    rx="220"
                    ry="148"
                    fill="url(#cloudGradientRight3)"
                    opacity="0.89"
                    animate={{
                      cy: [370, 360, 370],
                      rx: [220, 235, 220],
                    }}
                    transition={{ duration: 5.45, repeat: Infinity, ease: "easeInOut" }}
                  />
                </g>

                {/* Top layer - detailed smaller puffs */}
                <g filter="url(#cloudBlur)">
                  <motion.ellipse
                    cx="900"
                    cy="380"
                    rx="150"
                    ry="100"
                    fill="#ffffff"
                    opacity="0.95"
                    animate={{
                      cy: [380, 370, 380],
                      rx: [150, 160, 150],
                    }}
                    transition={{ duration: 4.3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="650"
                    cy="410"
                    rx="170"
                    ry="110"
                    fill="#ffffff"
                    opacity="0.97"
                    animate={{
                      cy: [410, 400, 410],
                      rx: [170, 180, 170],
                    }}
                    transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="380"
                    cy="420"
                    rx="190"
                    ry="120"
                    fill="#ffffff"
                    opacity="0.96"
                    animate={{
                      cy: [420, 410, 420],
                      rx: [190, 200, 190],
                    }}
                    transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="110"
                    cy="400"
                    rx="160"
                    ry="105"
                    fill="#ffffff"
                    opacity="0.94"
                    animate={{
                      cy: [400, 390, 400],
                      rx: [160, 170, 160],
                    }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="780"
                    cy="395"
                    rx="145"
                    ry="95"
                    fill="#ffffff"
                    opacity="0.96"
                    animate={{
                      cy: [395, 385, 395],
                      rx: [145, 155, 145],
                    }}
                    transition={{ duration: 4.55, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="510"
                    cy="425"
                    rx="165"
                    ry="108"
                    fill="#ffffff"
                    opacity="0.98"
                    animate={{
                      cy: [425, 415, 425],
                      rx: [165, 175, 165],
                    }}
                    transition={{ duration: 4.75, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="240"
                    cy="410"
                    rx="155"
                    ry="102"
                    fill="#ffffff"
                    opacity="0.95"
                    animate={{
                      cy: [410, 400, 410],
                      rx: [155, 165, 155],
                    }}
                    transition={{ duration: 4.35, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="20"
                    cy="390"
                    rx="140"
                    ry="93"
                    fill="#ffffff"
                    opacity="0.93"
                    animate={{
                      cy: [390, 380, 390],
                      rx: [140, 150, 140],
                    }}
                    transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut" }}
                  />
                </g>

                {/* Base coverage - ensures no gaps */}
                <rect x="0" y="0" width="1000" height="1000" fill="url(#cloudGradientRight3)" opacity="0.7" />
              </svg>
            </motion.div>

            {/* Center sun that fades before clouds open - matching main page decorative blobs */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* Outer glow layer - largest */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute w-[600px] h-[600px] bg-yellow-300 dark:bg-yellow-400 rounded-full blur-3xl"
              />
              {/* Middle layer */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute w-[450px] h-[450px] bg-yellow-400 dark:bg-yellow-500 rounded-full blur-3xl"
              />
              {/* Bright blurred center */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute w-[300px] h-[300px] bg-yellow-200 dark:bg-yellow-300 rounded-full blur-2xl"
              />
              {/* Solid visible sun core - NO BLUR */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute w-[200px] h-[200px] bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 dark:from-yellow-300 dark:via-yellow-400 dark:to-yellow-500 rounded-full shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Simplified Mobile Intro Animation */}
        {showIntro && isMobile && !prefersReducedMotion && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none bg-gradient-to-b from-sky-400 via-blue-300 to-blue-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-8xl"
              >
                ☀️
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Rain Effect */}
        {weather && (weather.main === "rain" || weather.main === "drizzle") && particleCount.rain > 0 && (
          <>
            {[...Array(particleCount.rain)].map((_, i) => (
              <motion.div
                key={`rain-${i}`}
                className="absolute w-0.5 h-12 bg-gradient-to-b from-blue-400/60 to-transparent"
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: -50,
                }}
                animate={{
                  y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
                  x: `${Math.random() * 100 - 5}%`,
                }}
                transition={{
                  duration: weather.main === "drizzle" ? 1.5 : 1,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
              />
            ))}
          </>
        )}

        {/* Snow Effect */}
        {weather && weather.main === "snow" && particleCount.snow > 0 && (
          <>
            {[...Array(particleCount.snow)].map((_, i) => (
              <motion.div
                key={`snow-${i}`}
                className="absolute text-2xl"
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: -20,
                }}
                animate={{
                  y: typeof window !== 'undefined' ? window.innerHeight + 20 : 1000,
                  x: `${Math.random() * 100 + Math.sin(i) * 10}%`,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear",
                }}
              >
                ❄️
              </motion.div>
            ))}
          </>
        )}

        {/* Sun Rays Effect */}
        {weather && weather.main === "clear" && (
          <>
            <motion.div
              className="absolute top-10 right-20 w-40 h-40 bg-yellow-300/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </>
        )}


        {/* Thunder/Lightning Effect */}
        {weather && weather.main === "thunderstorm" && (
          <>
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 bg-yellow-200/0"
                animate={{
                  backgroundColor: [
                    "rgba(254, 240, 138, 0)",
                    "rgba(254, 240, 138, 0.3)",
                    "rgba(254, 240, 138, 0)",
                  ],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 3,
                }}
              />
            )}
            {/* Rain for thunderstorm */}
            {particleCount.thunderstorm > 0 && [...Array(particleCount.thunderstorm)].map((_, i) => (
              <motion.div
                key={`storm-rain-${i}`}
                className="absolute w-0.5 h-16 bg-gradient-to-b from-blue-500/70 to-transparent"
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: -50,
                }}
                animate={{
                  y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
                  x: `${Math.random() * 100 - 15}%`,
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 shadow-2xl overflow-hidden"
      >
        {/* Animated background pattern */}
        {!isMobile && !prefersReducedMotion && (
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)",
                backgroundSize: "200% 200%",
                willChange: 'background-position',
              }}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
          >
            <TbArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Portfolio</span>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <motion.div
                  animate={!prefersReducedMotion ? {
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  style={{ willChange: !prefersReducedMotion ? 'transform' : 'auto' }}
                >
                  <WiDaySunny className="text-8xl text-yellow-300 drop-shadow-lg" />
                </motion.div>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                  Weather Forecast
                </h1>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 shadow-xl">
                <div className="text-xs text-white/80 font-medium">Last Updated</div>
                <motion.div
                  key={Math.floor(Date.now() / 1000)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-bold text-white"
                >
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <motion.path
              d="M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-slate-50 dark:text-slate-950"
              initial={{ d: "M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z" }}
              animate={{
                d: [
                  "M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z",
                  "M0,30 Q300,0 600,50 T1200,30 L1200,120 L0,120 Z",
                  "M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative" ref={suggestionRef}>
              <input
                ref={inputRef}
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search for a city..."
                className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                autoComplete="off"
              />

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={`${suggestion.lat}-${suggestion.lon}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          index === selectedIndex
                            ? "bg-blue-50 dark:bg-slate-800"
                            : "hover:bg-gray-50 dark:hover:bg-slate-800"
                        } ${index === 0 ? "" : "border-t border-gray-100 dark:border-slate-800"}`}
                      >
                        <div className="font-semibold text-gray-900 dark:text-white">{suggestion.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Search"}
            </button>

            <button
              type="button"
              onClick={toggleUnit}
              className="px-6 py-4 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all hover:shadow-md"
            >
              °{unit === "metric" ? "C" : "F"}
            </button>

            <button
              type="button"
              onClick={getCurrentLocation}
              className="px-6 py-4 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all hover:shadow-md"
              title="Use current location"
            >
              📍
            </button>
          </form>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400 font-medium shadow-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 rounded-3xl p-8 h-64 animate-pulse shadow-xl"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 rounded-2xl p-6 h-32 animate-pulse shadow-lg"></div>
              ))}
            </div>
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="space-y-6">
            {/* Current Weather */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-3xl p-10 text-white shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {weather.city}, {weather.country}
                  </h2>
                  <p className="text-xl capitalize opacity-90 mb-4">{weather.description}</p>
                  <div className="flex items-baseline gap-2">
                    <div className="text-6xl font-bold">{weather.temperature}°</div>
                    <div className="text-lg opacity-90">
                      Feels like {weather.feelsLike}°
                    </div>
                  </div>
                  <div className="mt-3 text-sm opacity-90">
                    H: {weather.tempMax}° / L: {weather.tempMin}°
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <motion.div
                    className="text-8xl"
                    animate={!prefersReducedMotion ? {
                      scale: [1, 1.1, 1],
                      rotate: weather.main === "clear" ? [0, 10, 0] : 0,
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ willChange: !prefersReducedMotion ? 'transform' : 'auto' }}
                  >
                    {getWeatherIcon(
                      weather.icon,
                      weather.main,
                      Date.now() / 1000 < weather.sunrise || Date.now() / 1000 > weather.sunset
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Humidity", value: `${weather.humidity}%`, icon: "💧" },
                { label: "Wind Speed", value: `${weather.windSpeed} ${unit === "metric" ? "m/s" : "mph"}`, icon: "💨" },
                { label: "Pressure", value: `${weather.pressure} hPa`, icon: "🌡️" },
                { label: "Visibility", value: `${weather.visibility} km`, icon: "👁️" },
                ...(weather.rain1h || weather.rain3h ? [{
                  label: "Rainfall",
                  value: weather.rain1h ? `${weather.rain1h} mm/h` : `${weather.rain3h} mm/3h`,
                  icon: "💧"
                }] : []),
              ].map((detail, index) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-gray-100 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-3xl mb-2">{detail.icon}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{detail.label}</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{detail.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Sun Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-gray-100 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3">
                  <WiDaySunny className="text-5xl text-orange-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Sunrise</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatTime(weather.sunrise)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-gray-100 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3">
                  <WiNightClear className="text-5xl text-indigo-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Sunset</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatTime(weather.sunset)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-gray-100 dark:border-slate-800 shadow-xl">
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setActiveTab("hourly")}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === "hourly"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }`}
                >
                  Hourly
                </button>
                <button
                  onClick={() => setActiveTab("daily")}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === "daily"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }`}
                >
                  7-Day
                </button>
              </div>

              {/* Hourly Forecast */}
              {activeTab === "hourly" && (
                <div>
                  {/* Day selector for hourly forecast */}
                  {dailyForecast.length > 0 && (
                    <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                      {dailyForecast.slice(0, 5).map((day, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedDayIndex(index)}
                          className={`px-5 py-2.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                            selectedDayIndex === index
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {index === 0 ? "Today" : `${day.day} ${day.date}`}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="overflow-x-auto -mx-2 px-2">
                    <div className="flex gap-4 min-w-max">
                      {hourlyForecast
                        .filter((hour) => {
                          if (selectedDayIndex === 0) {
                            // Today - show next 8 hours
                            return hourlyForecast.indexOf(hour) < 8;
                          } else {
                            // Other days - show hours for that specific day
                            const selectedDay = dailyForecast[selectedDayIndex];
                            return selectedDay && hour.date === selectedDay.date;
                          }
                        })
                        .map((hour, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col items-center gap-2 p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl min-w-[100px] border-2 border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                          >
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{hour.time}</div>
                            <div className="text-4xl my-2">
                              {getWeatherIcon(hour.icon, undefined, false)}
                            </div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{hour.temp}°</div>
                            {hour.pop > 0 && (
                              <div className="text-xs text-blue-600 dark:text-blue-400">
                                💧 {hour.pop}%
                              </div>
                            )}
                            {hour.rain && hour.rain > 0 && (
                              <div className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                                🌧️ {hour.rain.toFixed(1)} mm
                              </div>
                            )}
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Daily Forecast */}
              {activeTab === "daily" && (
                <div className="space-y-3">
                  {dailyForecast.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-gray-100 dark:border-slate-700 hover:shadow-md transition-all"
                    >
                      <div className="w-20">
                        <div className="font-semibold text-gray-900 dark:text-white">{day.day}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{day.date}</div>
                      </div>

                      <div className="text-4xl">
                        {getWeatherIcon(day.icon, undefined, false)}
                      </div>

                      <div className="flex-1 capitalize text-gray-700 dark:text-gray-300">
                        {day.description}
                        {(day.rain ?? 0) > 0 && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            🌧️ {Math.round(day.rain!)} mm
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{Math.round(day.tempMin)}°</div>
                        <div className="w-16 h-2 bg-gradient-to-r from-blue-400 to-red-400 rounded-full"></div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(day.tempMax)}°</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!weather && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={!prefersReducedMotion ? {
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1],
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="mb-6 inline-block"
              style={{ willChange: !prefersReducedMotion ? 'transform' : 'auto' }}
            >
              <WiDaySunny className="text-9xl text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Search for a city
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get real-time weather information for any location
            </p>
          </motion.div>
        )}

      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative w-full bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 dark:from-slate-950 dark:via-gray-950 dark:to-slate-950 mt-20 overflow-hidden"
      >
        {/* Top wave decoration */}
        <div className="absolute top-0 left-0 right-0 transform rotate-180">
          <svg className="w-full h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <motion.path
              d="M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-slate-50 dark:text-slate-950"
              initial={{ d: "M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z" }}
              animate={{
                d: [
                  "M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z",
                  "M0,30 Q300,0 600,50 T1200,30 L1200,120 L0,120 Z",
                  "M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Animated gradient overlay */}
        {!isMobile && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            style={{ willChange: 'background' }}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { Icon: TbWorldWww, label: "Global Coverage", value: "200+ Countries", delay: 0.6, color: "text-blue-400" },
              { Icon: TbBolt, label: "Real-time Updates", value: "Every 10 Minutes", delay: 0.7, color: "text-yellow-400" },
              { Icon: TbChartBar, label: "Extended Forecast", value: "7-Day Prediction", delay: 0.8, color: "text-purple-400" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl"
              >
                <motion.div
                  animate={!prefersReducedMotion ? {
                    rotate: [0, 5, -5, 0],
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                  className="mb-4"
                  style={{ willChange: !prefersReducedMotion ? 'transform' : 'auto' }}
                >
                  <stat.Icon className={`text-6xl ${stat.color}`} />
                </motion.div>
                <div className="text-white/60 text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-white text-xl font-bold">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Footer Content */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-center md:text-left"
              >
                <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <TbCloudDataConnection className="text-4xl text-blue-400" />
                  </motion.span>
                  Weather Forecast
                </h3>
                <p className="text-white/70">
                  Powered by OpenWeatherMap API
                </p>
                <p className="text-white/50 text-sm mt-2">
                  Built with Next.js, TypeScript & Framer Motion
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex flex-col items-center md:items-end gap-4"
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <TbArrowLeft />
                  Back to Portfolio
                </Link>
                <p className="text-white/50 text-sm">
                  © {new Date().getFullYear()} Dylan Swart. All rights reserved.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        {!isMobile && !prefersReducedMotion && [...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.footer>
    </div>
  );
}
