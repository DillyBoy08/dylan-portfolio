import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const unit = searchParams.get('unit') || 'metric';

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  if (!API_KEY || API_KEY === 'demo') {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  // Build query parameters
  let weatherQuery = '';
  let forecastQuery = '';

  if (lat && lon) {
    weatherQuery = `lat=${lat}&lon=${lon}`;
    forecastQuery = `lat=${lat}&lon=${lon}`;
  } else if (city) {
    weatherQuery = `q=${encodeURIComponent(city)}`;
    forecastQuery = `q=${encodeURIComponent(city)}`;
  } else {
    return NextResponse.json({ error: 'City or coordinates required' }, { status: 400 });
  }

  try {
    // Fetch current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${weatherQuery}&appid=${API_KEY}&units=${unit}`
    );

    if (!currentRes.ok) {
      const errorData = await currentRes.json();

      // Handle specific error codes
      if (currentRes.status === 401) {
        return NextResponse.json({
          error: 'API key not activated yet. Please wait a few minutes and try again, or check your API key.'
        }, { status: 401 });
      }

      return NextResponse.json({ error: errorData.message || 'City not found' }, { status: currentRes.status });
    }

    const currentData = await currentRes.json();

    // Fetch 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?${forecastQuery}&appid=${API_KEY}&units=${unit}`
    );

    let forecastData = null;
    if (forecastRes.ok) {
      forecastData = await forecastRes.json();
    }

    return NextResponse.json({
      current: currentData,
      forecast: forecastData,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
