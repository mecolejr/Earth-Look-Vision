const USER_AGENT = "(EarthLook, support@earthlook.app)";

interface WeatherPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  probabilityOfPrecipitation: { value: number | null } | null;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

interface ForecastResponse {
  updated: string;
  periods: WeatherPeriod[];
}

export async function getWeatherForecast(lat: number, lon: number): Promise<ForecastResponse> {
  // Step 1: Get the grid point info for the coordinates
  const pointResp = await fetch(
    `https://api.weather.gov/points/${lat},${lon}`,
    {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "application/geo+json"
      }
    }
  );

  if (!pointResp.ok) {
    throw new Error(`Failed to get point data: ${pointResp.status}`);
  }

  const pointData = await pointResp.json();
  const forecastUrl = pointData.properties?.forecast;

  if (!forecastUrl) {
    throw new Error("No forecast URL found for this location");
  }

  // Step 2: Get the forecast from the grid endpoint
  const forecastResp = await fetch(forecastUrl, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept": "application/geo+json"
    }
  });

  if (!forecastResp.ok) {
    throw new Error(`Failed to get forecast: ${forecastResp.status}`);
  }

  const forecastData = await forecastResp.json();

  return {
    updated: forecastData.properties.updated,
    periods: forecastData.properties.periods
  };
}

export async function getCurrentWeather(lat: number, lon: number) {
  const forecast = await getWeatherForecast(lat, lon);
  const current = forecast.periods[0];
  
  return {
    updated: forecast.updated,
    name: current.name,
    temperature: current.temperature,
    temperatureUnit: current.temperatureUnit,
    shortForecast: current.shortForecast,
    detailedForecast: current.detailedForecast,
    windSpeed: current.windSpeed,
    windDirection: current.windDirection,
    isDaytime: current.isDaytime,
    icon: current.icon
  };
}
